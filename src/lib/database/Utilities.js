/* export function fieldsToString(array) {
    return array.join(', ');
}
// TODO: FULLY REWRITE BASED ON MSSQL V4 -> https://www.npmjs.com/package/mssql#es6-tagged-template-literals
export function objectToInsertValues(object) {
    let keysToInsert = [];
    let valuesToInsert = '';

    Object.keys(object).forEach((key) => {
        keysToInsert.push(key);
        if (object[key] === null) {
            valuesToInsert += `${null}, `;
        } else {
            valuesToInsert += `'${object[key]}', `;
        }
    });

    keysToInsert = fieldsToString(keysToInsert);
    valuesToInsert = valuesToInsert.substring(0, valuesToInsert.length - 2);

    return { keys: keysToInsert, values: valuesToInsert };
}

export function objectToSetValues(object, output) {
    let valuesToSet = '';
    let outputKeys = '';

    Object.keys(object).forEach((key) => {
        if (object[key] === null) {
            valuesToSet += `${key}=${null}, `;
        } else {
            valuesToSet += `${key}='${object[key]}', `;
        }
    });

    output.forEach((o) => {
        outputKeys += `INSERTED.${o}, `;
    });

    valuesToSet = valuesToSet.substring(0, valuesToSet.length - 2);
    outputKeys = outputKeys.substring(0, outputKeys.length - 2);

    return { values: valuesToSet, out: outputKeys };
}

export function objectToFilterValues(object) {
    let filters = '';

    Object.keys(object).forEach((key) => {
        if (object[key] === null) {
            filters += `${key}=${null} AND `;
        } else {
            filters += `${key}='${object[key]}' AND `;
        }
    });

    return filters.substring(0, filters.length - 5);
}*/
