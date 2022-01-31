const express = require('express');
const mysql = require('mysql');

const app = express();

app.use(express.json());

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'bike_db'
});

db.connect((err) => {
  if(err){
    throw err;
  }
  console.log('mysql connected');
});


app.get('/bike', (req, res) => {
  const search = req.query.search;
  const category = req.query.category;
  const supplier = req.query.supplier;

  let condition = '1=1 ';

  if(req.query.category.length != 0)
  {
    condition += `AND c.category_id = '${category}' `;
  }
  if(req.query.supplier.length != 0)
  {
    condition += `AND s.supplier_id = '${supplier}' `;
  }
  if(req.query.search.length != 0)
  {
    condition += `AND b.bike_name LIKE '${search}%' `;
  }
  
  condition += `ORDER BY b.bike_name`;

  let sql = `
    SELECT 
      b.*, c.category_name, s.supplier_name
    FROM bike_table b
    INNER JOIN category_table c ON b.category_id = c.category_id
    INNER JOIN supplier_table s ON b.supplier_id = s.supplier_id
    WHERE 
  `+condition;
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.send(result);
  });
});

app.get('/bike/category', (req, res) => {
  let sql = 'SELECT * FROM category_table';
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.send(result);
  });
});

app.get('/bike/supplier', (req, res) => {
  let sql = 'SELECT * FROM supplier_table';
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.send(result);
  });
});

app.post('/bike/add', (req, res) => {

  let data =  req.body.data;

  const bike_name = data.bikeName;
  const category_id = data.categoryId;
  const supplier_id = data.supplierId;
  const quantity_on_hand = data.quantityOnHand;
  const selling_price = data.sellingPrice;
  const purchase_cost = data.purchaseCost;

  var sql = `
    INSERT INTO bike_table 
      (bike_name, category_id, supplier_id, quantity_on_hand, selling_price, purchase_cost)
    VALUES (
      '${bike_name}',
      '${category_id}',
      '${supplier_id}',
      '${quantity_on_hand}',
      '${selling_price}',
      '${purchase_cost}'
    );
  `;

  db.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
});

app.put('/bike/update', (req, res) => {

  let data =  req.body.data;

  const bike_id = data.bikeId;
  const bike_name = data.bikeName;
  const category_id = data.categoryId;
  const supplier_id = data.supplierId;
  const quantity_on_hand = data.quantityOnHand;
  const selling_price = data.sellingPrice;
  const purchase_cost = data.purchaseCost;

  var sql = `
    UPDATE bike_table
    SET 
      bike_name = '${bike_name}', 
      category_id = '${category_id}',
      supplier_id = '${supplier_id}', 
      quantity_on_hand = '${quantity_on_hand}',
      selling_price = '${selling_price}',
      purchase_cost = '${purchase_cost}'
    WHERE 
      bike_id = '${bike_id}'
  `;

  db.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
});

app.delete('/bike/delete', (req, res) => {

  let data = req.body.toString();

  var sql = `DELETE FROM bike_table WHERE bike_id IN (${data})`;

  db.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
});


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));