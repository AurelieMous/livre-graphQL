import CoreDatamapper from "./codeDataMapper";
import {Livre as ILivre, Pagination} from "../../../types";

class Livre extends CoreDatamapper<ILivre>{
    tableName = "livre";
    defaultOrderBy = "titre";

    // On ajoute des fonctions en plus de celles de base dans le core Data Mapper
    async findByAuteur(auteurId: number, pagination: Pagination) {
        const { limit, offset, orderBy, direction } = this.preparePaginationParams(pagination);
        const preparedQuery = {
            text: `SELECT * FROM "${this.tableName}" 
               WHERE auteur_id = $1 
               ORDER BY "${orderBy}" ${direction} 
               LIMIT $2 OFFSET $3`,
            values: [auteurId, limit, offset],
        };
        const results = await this.client.query(preparedQuery);
        return results.rows;
    }

    async findByTheme(themeId: number, pagination: Pagination) {
        const { limit, offset, orderBy, direction } = this.preparePaginationParams(pagination);
        const preparedQuery = {
            text: `SELECT * FROM "${this.tableName}"
            WHERE theme_id = $1
            ORDER BY "${orderBy}" ${direction}
            LIMIT $2 OFFSET $3`,
            values: [themeId, limit, offset],
        }
        const results = await this.client.query(preparedQuery);
        return results.rows;
    }

    async findByPays(payId: number, pagination: Pagination) {
        const { limit, offset, orderBy, direction } = this.preparePaginationParams(pagination);
        const preparedQuery = {
            text: `SELECT * FROM "${this.tableName}"
            WHERE pays_id = $1
            ORDER BY "${payId}" ${direction}
            LIMIT $2 OFFSET $3`,
            values: [payId, limit, offset],
        }
        const results = await this.client.query(preparedQuery);
        return results.rows;
    }
}

export default Livre;