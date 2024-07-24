export function getCollection(db, collectionName) {
    return db.collection(collectionName);
}

export async function insertDocument(db, collectionName, document) {
    const collection = getCollection(db, collectionName);
    await collection.insertOne(document);
}

export async function findDocument(db, collectionName, filter) {
    const collection = getCollection(db, collectionName);
    return await collection.findOne(filter);
}

export async function updateDocument(db, collectionName, filter, update) {
    const collection = getCollection(db, collectionName);
    await collection.updateOne(filter, { $set: update });
}

export async function deleteDocument(db, collectionName, filter) {
    const collection = getCollection(db, collectionName);
    await collection.deleteOne(filter);
}
