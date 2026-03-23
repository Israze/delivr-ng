const supabase = require("../config/supabase");
const { getDistanceInKm } = require("../utils/distance");

const getEstimate = async ({ from, to, state_code, vehicle }) => {
  // Fetch from LGA
  const { data: fromLga, error: fromError } = await supabase
    .from("lgas")
    .select("id, name, latitude, longitude, state_code")
    .eq("state_code", state_code.toUpperCase())
    .ilike("name", from)
    .single();

  if (fromError || !fromLga)
    throw new Error(`LGA '${from}' not found in state '${state_code}'`);

  // Fetch to LGA
  const { data: toLga, error: toError } = await supabase
    .from("lgas")
    .select("id, name, latitude, longitude, state_code")
    .eq("state_code", state_code.toUpperCase())
    .ilike("name", to)
    .single();

  if (toError || !toLga)
    throw new Error(`LGA '${to}' not found in state '${state_code}'`);

  // Calculate distance
  const distance_km = getDistanceInKm(
    { lat: fromLga.latitude, lng: fromLga.longitude },
    { lat: toLga.latitude, lng: toLga.longitude }
  );

  // Fetch providers for this state
  const { data: providers, error: providersError } = await supabase
    .from("providers")
    .select("*")
    .eq("active", true);

  if (providersError) throw new Error(providersError.message);

  // Filter by distance and vehicle
  let available = providers.filter(
    (p) =>
      distance_km >= p.min_distance_km &&
      distance_km <= p.max_distance_km
  );

  if (vehicle) {
    available = available.filter((p) =>
      p.vehicle_types.includes(vehicle.toLowerCase())
    );

    if (available.length === 0)
      throw new Error(
        `No providers available for vehicle type '${vehicle}'`
      );
  }

  // Build estimates
  const estimates = available.map((p) => {
    const base = p.base_fare + distance_km * p.per_km_rate;
    const min = Math.round(base * 0.9);
    const max = Math.round(base * 1.1);

    return {
      provider: p.name,
      provider_id: p.id,
      vehicle_types: vehicle ? [vehicle] : p.vehicle_types,
      fee_range: {
        min,
        max,
        currency: "NGN",
      },
    };
  });

  return {
    from: fromLga.name,
    to: toLga.name,
    state_code: state_code.toUpperCase(),
    distance_km,
    estimates,
    note: "Estimates are approximate. Actual price may vary by provider.",
  };
};

module.exports = { getEstimate };