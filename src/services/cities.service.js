const supabase = require("../config/supabase");

const getAllCities = async () => {
  const { data, error } = await supabase
    .from("states")
    .select("id, name, code")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

const getCityByCode = async (code) => {
  const { data: state, error: stateError } = await supabase
    .from("states")
    .select("id, name, code")
    .eq("code", code.toUpperCase())
    .single();

  if (stateError || !state) throw new Error(`State '${code}' not found`);

  const { data: lgas, error: lgasError } = await supabase
    .from("lgas")
    .select("id, name, latitude, longitude")
    .eq("state_id", state.id)
    .order("name", { ascending: true });

  if (lgasError) throw new Error(lgasError.message);

  return { ...state, lgas };
};

module.exports = { getAllCities, getCityByCode };