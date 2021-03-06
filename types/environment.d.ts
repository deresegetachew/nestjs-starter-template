declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DB_HOST: string;
        DB_PORT: any;
        DB_USER:string;
        DB_PASSWORD:string;
        DB_NAME:string;

        NODE_ENV: 'development' | 'production' | 'testing';
        PORT?:  any
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}