export { }

const functions = require('firebase-functions');
const admin = require("firebase-admin");
const cors = require('cors');
const express = require('express');
const server = express();
server.use(cors());
server.post('*/', function (req: any, res: any) {
    const { parentDocId, name, emailAddress, role } = req.body;

    const newOfficer = {
        name: {
            certification: '',
            validation: '',
            source: 'entry',
            value: name
        },
        fullName: {
            certification: '',
            validation: '',
            source: 'entry',
            value: name
        },
        emailAddress: {
            certification: '',
            validation: '',
            source: 'entry',
            value: emailAddress
        },
    } as { [key: string]: any };

    const documentParts = parentDocId.split("/");

    const parentId = documentParts.pop();

    return admin.firestore().collection('persons')
        .add(newOfficer)
        .then(function (docRef: any) {
            console.log("Officer written with ID: ", docRef.id, newOfficer);

            const newRelationship = {
                source: admin.firestore().doc(`/persons/${docRef.id}`),
                target: admin.firestore().doc(`/companies/${parentId}`),
                type: 'officer',
                title: role
            }

            return admin.firestore().collection('relationships')
                .add(newRelationship)
                .then(function (relRef: any) {
                    console.log("Relationship written with ID: ", relRef.id);
                    return res.send({ msg: `Added ${name}:${role}%` });
                })
                .catch(function (error: string) {
                    console.error("Error adding Relationship: ", error);
                    return res.send({ msg: `Error adding Relationship ${name}:${role}%` });
                });
        })
        .catch(function (error: string) {
            console.error("Error adding Officer: ", error);
            return res.send({ msg: `Error adding Officer ${name}:${role}%` });
        });
});
module.exports = functions.https.onRequest(server);
