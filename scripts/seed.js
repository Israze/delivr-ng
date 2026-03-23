const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const lgas = JSON.parse(
  fs.readFileSync(path.join(__dirname, "nigeria_lgas.json"), "utf-8")
);

// Extract unique states from LGA data
const extractStates = () => {
  const stateMap = new Map();
  lgas.forEach((lga) => {
    if (!stateMap.has(lga.state_code)) {
      stateMap.set(lga.state_code, {
        name: lga.state_name,
        code: lga.state_code,
      });
    }
  });
  return Array.from(stateMap.values());
};

const seedStates = async () => {
  console.log("Seeding states...");
  const states = extractStates();

  const { error } = await supabase.from("states").insert(states);

  if (error) {
    console.error("Error seeding states:", error.message);
    return false;
  }

  console.log(`✅ Seeded ${states.length} states`);
  return true;
};

const seedLgas = async () => {
  console.log("Seeding LGAs...");

  // Fetch inserted states to get their IDs
  const { data: states, error: statesError } = await supabase
    .from("states")
    .select("id, code");

  if (statesError) {
    console.error("Error fetching states:", statesError.message);
    return false;
  }

  const stateCodeToId = {};
  states.forEach((s) => (stateCodeToId[s.code] = s.id));

  // Map LGAs to our schema
  const lgaRows = lgas.map((lga) => ({
    name: lga.name,
    state_id: stateCodeToId[lga.state_code],
    state_code: lga.state_code,
    state_name: lga.state_name,
    latitude: lga.latitude,
    longitude: lga.longitude,
  }));

  // Insert in batches of 100 to avoid hitting Supabase limits
  const batchSize = 100;
  for (let i = 0; i < lgaRows.length; i += batchSize) {
    const batch = lgaRows.slice(i, i + batchSize);
    const { error } = await supabase.from("lgas").insert(batch);

    if (error) {
      console.error(`Error seeding LGAs batch ${i}:`, error.message);
      return false;
    }

    console.log(`Inserted LGAs ${i + 1} to ${Math.min(i + batchSize, lgaRows.length)}`);
  }

  console.log(`✅ Seeded ${lgaRows.length} LGAs`);
  return true;
};

const seedProviders = async () => {
  console.log("Seeding providers...");

  const providers = [
    {
      id: "kwik",
      name: "Kwik Delivery",
      website: "https://kwik.delivery",
      vehicle_types: ["bike", "car"],
      base_fare: 400,
      per_km_rate: 100,
      min_distance_km: 1,
      max_distance_km: 50,
      cities: ["lagos"],
      active: true,
    },
    {
      id: "sendbox",
      name: "Sendbox",
      website: "https://sendbox.co",
      vehicle_types: ["bike", "van"],
      base_fare: 600,
      per_km_rate: 120,
      min_distance_km: 1,
      max_distance_km: 100,
      cities: ["lagos", "abuja", "port-harcourt"],
      active: true,
    },
    {
      id: "gig",
      name: "GIG Logistics",
      website: "https://giglogistics.com.ng",
      vehicle_types: ["van", "truck"],
      base_fare: 800,
      per_km_rate: 150,
      min_distance_km: 5,
      max_distance_km: 500,
      cities: ["lagos", "abuja", "port-harcourt", "kano", "ibadan"],
      active: true,
    },
    {
      id: "errand360",
      name: "Errand360",
      website: "https://errand360.com",
      vehicle_types: ["bike"],
      base_fare: 350,
      per_km_rate: 90,
      min_distance_km: 1,
      max_distance_km: 30,
      cities: ["lagos", "abuja"],
      active: true,
    },
  ];

  const { error } = await supabase.from("providers").insert(providers);

  if (error) {
    console.error("Error seeding providers:", error.message);
    return false;
  }

  console.log(`✅ Seeded ${providers.length} providers`);
  return true;
};

const seed = async () => {
  console.log("🌱 Starting seed...\n");

//   const statesOk = await seedStates();
//   if (!statesOk) return;

//   const lgasOk = await seedLgas();
//   if (!lgasOk) return;

  const providersOk = await seedProviders();
  if (!providersOk) return;

  console.log("\n🎉 Seed complete!");
};

seed();