export const getStraightDistanceBetweenTwoPoints = (
  source_lat: number | null | undefined,
  source_long: number | null | undefined,
  destination_lat: number | null | undefined,
  destination_long: number | null | undefined
): number | null => {
  if (!source_lat || !source_long || !destination_lat || !destination_long) {
    return null;
  }
  const angle_source_lat = (source_lat * Math.PI) / 180;
  const angle_destination_lat = (destination_lat * Math.PI) / 180;
  const angle_source_long = (source_long * Math.PI) / 180;
  const angle_destination_long = (destination_long * Math.PI) / 180;
  const angle_lat_diference = angle_destination_lat - angle_source_lat;
  const angle_long_diference = angle_destination_long - angle_source_long;
  const haversine_auxiliar_angle =
    Math.pow(Math.sin(angle_lat_diference / 2), 2) +
    Math.cos(angle_source_lat) * Math.cos(angle_destination_lat) * Math.pow(Math.sin(angle_long_diference / 2), 2);
  const earth_center_angle = 2 * Math.asin(Math.sqrt(haversine_auxiliar_angle));
  const earth_radius_meters = 6371000;
  return Math.round(earth_center_angle * earth_radius_meters);
};
