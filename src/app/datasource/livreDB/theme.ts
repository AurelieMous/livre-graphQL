import CoreDatamapper from "./codeDataMapper";
import { Theme as ITheme } from "../../../types"

class Theme extends CoreDatamapper<ITheme>{
    tableName = "theme";
    defaultOrderBy = "titre";
}

export default Theme;