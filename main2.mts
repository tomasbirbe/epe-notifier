const response = await fetch(
  "https://epe.santafe.gov.ar/institucional-api/cortes-programados/247/2025-09-30",
  {
    headers: {"X-Api-Key": "d745e6f4-6dd6-41b8-9a21-859e9bd1284b"},
  },
);

console.log(response);
if (response.ok) {
  const data = await response.json();

  console.log(data);
}
