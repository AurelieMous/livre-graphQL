import CoreDatamapper from "./codeDataMapper";
import {Auteur as IAuteur} from "../../../types";

class Auteur extends CoreDatamapper<IAuteur>{
    tableName = "auteur";
    defaultOrderBy = "nom"
}

export default Auteur;