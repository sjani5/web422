/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Shubh Jani Student ID: 153660212 Date: 15 Sep 2023
*  Cyclic Link: https://fair-cyan-moth-wear.cyclic.app
*
********************************************************************************/ 


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8080;
const CompaniesDB = require("./modules/companiesDB.js");
const db = new CompaniesDB();

app.use(cors());
app.use(express.json());

const initializeDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

initializeDb();

app.get('/', (req, res) => {
  res.json({ message: 'API Listening' });
});


app.post('/api/companies', async (req, res) => {
  try {
    const data = req.body;
    const result = await db.addNewCompany(data);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/companies', async (req, res) => {
  try {
    const { page, perPage, tag } = req.query;
    const companies = await db.getAllCompanies(page, perPage, tag);
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/company/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const company = await db.getCompanyByName(name);
    if (!company) {
      res.status(404).json({ error: 'Company not found' });
    } else {
      res.json(company);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/company/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const data = req.body;
    const result = await db.updateCompanyByName(data, name);
    if (!result) {
      res.status(404).json({ error: 'Company not found' });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/company/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const result = await db.deleteCompanyByName(name);
    if (!result) {
      res.status(404).json({ error: 'Company not found' });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
