-- Active: 1682022373461@@127.0.0.1@3306
 CREATE Table users (
  id text PRIMARY KEY UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TEXT DEFAULT (DATETIME()) NOT NULL
 );

CREATE Table products (
  id text PRIMARY KEY UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL
);

CREATE Table purchases (
  id text PRIMARY KEY UNIQUE NOT NULL,
  buyer TEXT NOT NULL,
  total_price REAL NOT NULL,
  created_at TEXT DEFAULT (DATETIME('now', 'localtime')) NOT NULL,
  paid INTEGER DEFAULT(0) NOT NULL,
  buyer_id TEXT NOT NULL,
  Foreign Key (buyer_id) REFERENCES users (id)
);



CREATE Table purchases_products (
  purchase_id text NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (purchase_id) REFERENCES purchases (id),
  FOREIGN KEY (product_id) REFERENCES products (id)
);

INSERT INTO users(id, name, email, password)
VALUES
("U001", "TEEMO", "teemo@email.com", "T01234"),
("U002", "APHELIOS", "aphelios@email.com", "A54321");

INSERT INTO products(id, name, price, description, image_url)
VALUES
("P001", "Mouse gamer", 250, "Melhor mouse do mercado!", "https://picsum.photos/seed/Mouse%20gamer/400"),
("P002", "Teclado gamer", 200, "Teclado mecânico com numpad", "https://picsum.photos/seed/Teclado%20gamer/400");

INSERT INTO purchases VALUES
("PC001", "APHELIOS", 250, (DATETIME('now','localtime')), 0, "U002"),
("PC002", "APHELIOS", 900, (DATETIME('now','localtime')), 0, "U002"),
("PC003", "TEEMO", 250, (DATETIME('now','localtime')), 0, "U001"),
("PC004", "JHIN", 400, (DATETIME('now','localtime')), 0, "U003");

INSERT INTO purchases_products VALUES
("PC001", "P001", 1),
("PC002", "P003", 1),
("PC003", "P001", 1),
("PC004", "P002", 2);

SELECT * FROM purchases_products
INNER JOIN products ON purchases_products.product_id = products.id
INNER JOIN purchases ON purchases_products.purchase_id = purchases.id
INNER JOIN users ON purchases.buyer_id = users.id;

