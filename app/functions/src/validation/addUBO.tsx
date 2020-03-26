export { }

const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const server = express();
server.use(cors());
server.post('*/', function (req: any, res: any) {
    const { parentDocId, type, percentage, name, role } = req.body;

    const newUBO = {
        name: {
            certification: '',
            validation: '',
            source: 'entry',
            value: name
        },
        shareholderType: {
            certification: '',
            validation: '',
            source: 'entry',
            value: type === 'persons' ? 'P' : 'C'
        }
    } as { [key: string]: any };

    if (role) {
        newUBO.role = {
            certification: '',
            validation: '',
            source: 'entry',
            value: role
        }
    }

    const documentParts = parentDocId.split("/");

    const parentId = documentParts.pop();

    return admin.firestore().collection(type)
        .add(newUBO)
        .then(function (docRef: any) {
            console.log("UBO written with ID: ", docRef.id, newUBO);

            const newRelationship = {
                source: admin.firestore().doc(`/${type}/${docRef.id}`),
                target: admin.firestore().doc(`/companies/${parentId}`),
                type: 'shareholder',
                percentage: {
                    certification: '',
                    validation: '',
                    source: 'entry',
                    value: percentage
                },
            }

            return admin.firestore().collection('relationships')
                .add(newRelationship)
                .then(function (relRef: any) {
                    console.log("Relationship written with ID: ", relRef.id);
                    return res.send({ msg: `Added ${name}:${percentage}%` });
                })
                .catch(function (error: string) {
                    console.error("Error adding Relationship: ", error);
                    return res.send({ msg: `Error adding Relationship ${name}:${percentage}%` });
                });
        })
        .catch(function (error: string) {
            console.error("Error adding UBO: ", error);
            return res.send({ msg: `Error adding UBO ${name}:${percentage}%` });
        });
});
module.exports = functions.https.onRequest(server);
