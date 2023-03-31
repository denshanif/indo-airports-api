const express = require('express');
const app = express();
const port = 3000;
const { db } = require('./firebase.js');
const { nanoid } = require('nanoid');

app.use(express.json());

// get all airports
app.get('/airports', async (req, res) => {
  const airportRef = db.collection('airports');
  const snapshot = await airportRef.get();
  if (!snapshot.empty) {
    const airports = [];
    snapshot.forEach((doc) => {
      airports.push(doc.data());
    });
    res.send(airports);
  } else {
    res.status(404).send('No airports found in database');
  }
});

// get airport by id
app.get('/airports/:id', async (req, res) => {
  const airportRef = db.collection('airports').doc(req.params.id);
  const doc = await airportRef.get();
  if (doc.exists) {
    res.send(doc.data());
  } else {
    res.status(404).send(`Airport with id ${req.params.id} not found`);
  }
});

// get airport by iata
app.get('/airports/iata/:iata', async (req, res) => {
  const airportRef = db.collection('airports');
  const snapshot = await airportRef.where('iata', '==', req.params.iata).get();
  if (!snapshot.empty) {
    const airports = [];
    snapshot.forEach((doc) => {
      airports.push(doc.data());
    });
    res.send(airports);
  } else {
    res.status(404).send(`Airport with iata ${req.params.iata} not found`);
  }
});

// get airport by icao
app.get('/airports/icao/:icao', async (req, res) => {
  const airportRef = db.collection('airports');
  const snapshot = await airportRef.where('icao', '==', req.params.icao).get();
  if (!snapshot.empty) {
    const airports = [];
    snapshot.forEach((doc) => {
      airports.push(doc.data());
    });
    res.send(airports);
  } else {
    res.status(404).send(`Airport with icao ${req.params.icao} not found`);
  }
});

// post airport
app.post('/airports', async (req, res) => {
  const {
    iata,
    icao,
    name,
    city,
    province,
    country,
  } = req.body;

  if (iata && icao && name && city && province && country) {
    const id = nanoid();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const airport = {
      id,
      iata,
      icao,
      name,
      city,
      province,
      country,
      createdAt,
      updatedAt,
    };
    const airportRef = db.collection('airports');
    // check if airport already exists by iata or icao
    const iataSnapshot = await airportRef.where('iata', '==', iata).get();
    const icaoSnapshot = await airportRef.where('icao', '==', icao).get();

    if (iataSnapshot.empty && icaoSnapshot.empty) {
      await airportRef.doc(id).set(airport);
      res.send(airport);
    }
    else {
      res.status(400).send(`Airport with iata ${iata} or icao ${icao} already exists`);
    }
  } else {
    res.status(400).send('Missing required fields');
  }
});


// put airport by iata
app.put('/airports/iata/:iata', async (req, res) => {
  const {
    iata,
    icao,
    name,
    city,
    province,
    country,
  } = req.body;

  if (iata && icao && name && city && province && country) {
    const airportRef = db.collection('airports');
    const snapshot = await airportRef.where('iata', '==', req.params.iata).get();
    if (!snapshot.empty) {
      const airports = [];
      snapshot.forEach((doc) => {
        airports.push(doc.data());
      });
      const airport = airports[0];
      const id = airport.id;
      const createdAt = airport.createdAt;
      const updatedAt = new Date().toISOString();
      const updatedAirport = {
        id,
        iata,
        icao,
        name,
        city,
        province,
        country,
        createdAt,
        updatedAt,
      };
      // check if there is another airport with different iata but same icao
      const icaoSnapshot = await airportRef.where('icao', '==', icao).get();
      if (!icaoSnapshot.empty) {
        const icaoAirports = [];
        icaoSnapshot.forEach((doc) => {
          icaoAirports.push(doc.data());
        });
        const icaoAirport = icaoAirports[0];
        if (icaoAirport.iata !== iata) {
          res.status(400).send(`Airport with icao ${icao} already exists`);
          return;
        }
      }
      await airportRef.doc(id).set(updatedAirport);
      res.send(updatedAirport);
    } else {
      res.status(404).send(`Airport with iata ${req.params.iata} not found`);
    }
  } else {
    res.status(400).send('Missing required fields');
  }
});

// put airport by icao
app.put('/airports/icao/:icao', async (req, res) => {
  const {
    iata,
    icao,
    name,
    city,
    province,
    country,
  } = req.body;

  if (iata && icao && name && city && province && country) {
    const airportRef = db.collection('airports');
    const snapshot = await airportRef.where('icao', '==', req.params.icao).get();
    if (!snapshot.empty) {
      const airports = [];
      snapshot.forEach((doc) => {
        airports.push(doc.data());
      });
      const airport = airports[0];
      const id = airport.id;
      const createdAt = airport.createdAt;
      const updatedAt = new Date().toISOString();
      const updatedAirport = {
        id,
        iata,
        icao,
        name,
        city,
        province,
        country,
        createdAt,
        updatedAt,
      };
      // check if there is another airport with different icao but same iata
      const iataSnapshot = await airportRef.where('iata', '==', iata).get();
      if (!iataSnapshot.empty) {
        const iataAirports = [];
        iataSnapshot.forEach((doc) => {
          iataAirports.push(doc.data());
        });
        const iataAirport = iataAirports[0];
        if (iataAirport.icao !== icao) {
          res.status(400).send(`Airport with iata ${iata} already exists`);
          return;
        }
      }
      await airportRef.doc(id).set(updatedAirport);
      res.send(updatedAirport);
    } else {
      res.status(404).send(`Airport with icao ${req.params.icao} not found`);
    }
  } else {
    res.status(400).send('Missing required fields');
  }
});

// patch airport name, city, province, country by iata
app.patch('/airports/iata/:iata', async (req, res) => {
  const {
    name,
    city,
    province,
    country,
  } = req.body;

  if (name || city || province || country) {
    const airportRef = db.collection('airports');
    const snapshot = await airportRef.where('iata', '==', req.params.iata).get();
    if (!snapshot.empty) {
      const airports = [];
      snapshot.forEach((doc) => {
        airports.push(doc.data());
      });
      const airport = airports[0];
      const id = airport.id;
      const iata = airport.iata;
      const icao = airport.icao;
      const createdAt = airport.createdAt;
      const updatedAt = new Date().toISOString();
      const updatedAirport = {
        id,
        iata,
        icao,
        name: name || airport.name,
        city: city || airport.city,
        province: province || airport.province,
        country: country || airport.country,
        createdAt,
        updatedAt,
      };
      await airportRef.doc(id).set(updatedAirport);
      res.send(updatedAirport);
    } else {
      res.status(404).send(`Airport with iata ${req.params.iata} not found`);
    }
  } else {
    res.status(400).send('Missing required fields');
  }
});
  
// patch airport name, city, province, country by icao
app.patch('/airports/icao/:icao', async (req, res) => {
  const {
    name,
    city,
    province,
    country,
  } = req.body;
  
  if (name || city || province || country) {
    const airportRef = db.collection('airports');
    const snapshot = await airportRef.where('icao', '==', req.params.icao).get();
    if (!snapshot.empty) {
      const airports = [];
      snapshot.forEach((doc) => {
        airports.push(doc.data());
      });
      const airport = airports[0];
      const id = airport.id;
      const iata = airport.iata;
      const icao = airport.icao;
      const createdAt = airport.createdAt;
      const updatedAt = new Date().toISOString();
      const updatedAirport = {
        id,
        iata,
        icao,
        name: name || airport.name,
        city: city || airport.city,
        province: province || airport.province,
        country: country || airport.country,
        createdAt,
        updatedAt,
      };
      await airportRef.doc(id).set(updatedAirport);
      res.send(updatedAirport);
    } else {
      res.status(404).send(`Airport with icao ${req.params.icao} not found`);
    }
  } else {
    res.status(400).send('Missing required fields');
  }
});   

// delete airport by iata
app.delete('/airports/iata/:iata', async (req, res) => {
  const airportRef = db.collection('airports');
  const snapshot = await airportRef.where('iata', '==', req.params.iata).get();
  if (!snapshot.empty) {
    const airports = [];
    snapshot.forEach((doc) => {
      airports.push(doc.data());
    });
    const airport = airports[0];
    const id = airport.id;
    await airportRef.doc(id).delete();
    res.send(`Airport with iata ${req.params.iata} deleted`);
  } else {
    res.status(404).send(`Airport with iata ${req.params.iata} not found`);
  }
});

// delete airport by icao
app.delete('/airports/icao/:icao', async (req, res) => {
  const airportRef = db.collection('airports');
  const snapshot = await airportRef.where('icao', '==', req.params.icao).get();
  if (!snapshot.empty) {
    const airports = [];
    snapshot.forEach((doc) => {
      airports.push(doc.data());
    });
    const airport = airports[0];
    const id = airport.id;
    await airportRef.doc(id).delete();
    res.send(`Airport with icao ${req.params.icao} deleted`);
  } else {
    res.status(404).send(`Airport with icao ${req.params.icao} not found`);
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});