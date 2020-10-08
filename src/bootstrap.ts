import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrapREST(userConfig: UserConfig) {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT || 3000);
}


async function bootstrapRPC() {
    const appRpc = await NestFactory.createMicroservice(AppModule, micro)
}