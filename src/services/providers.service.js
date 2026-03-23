const supabase = require("../config/supabase");

const getAllProviders = async (city) => {
  let query = supabase
    .from("providers")
    .select("*")
    .eq("active", true);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  if (city) {
    const filtered = data.filter((p) =>
      p.cities.includes(city.toLowerCase())
    );
    if (filtered.length === 0)
      throw new Error(`No providers found for city '${city}'`);
    return filtered;
  }

  return data;
};

const getProviderById = async (id) => {
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("id", id.toLowerCase())
    .single();

  if (error || !data) throw new Error(`Provider '${id}' not found`);
  return data;
};

module.exports = { getAllProviders, getProviderById };