import { Service } from "@sap/cds/apis/services";
import EntityFactory from "./core/EntityFactory";

export = async (srv: Service) => {
    await EntityFactory.getInstance().applyHandlers(srv);
};