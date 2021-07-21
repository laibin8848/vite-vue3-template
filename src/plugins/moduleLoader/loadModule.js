export default async (module) => {
  const customImport = await import("./loadModule/load_" + process.env.NODE_ENV);
  let customModule = await customImport.default(module)
  return customModule.default
}
