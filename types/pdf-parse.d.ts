declare module 'pdf-parse' {
  const parse: (data: Buffer | Uint8Array, options?: any) => Promise<{ text?: string } & any>;
  export default parse;
}
