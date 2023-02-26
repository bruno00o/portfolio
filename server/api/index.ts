
export default defineEventHandler(async () => {
  const data = await useStorage().getItem('assets/lang/fr.json');
  return data;
})
