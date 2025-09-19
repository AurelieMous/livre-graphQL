import CoreDatamapper from "./codeDataMapper";
import { Pays as IPays } from "../../../types";

class Pays extends CoreDatamapper<IPays>{
    tableName = "pays"
    defaultOrderBy = "nom"
}

export default Pays;