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
  created_at TEXT DEFAULT (DATETIME()) NOT NULL,
  paid INTEGER DEFAULT(0) NOT NULL,
  Foreign Key (buyer) REFERENCES users (id)
);

CREATE Table purchases_products (
  purchase_id text NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER DEFAULT(1) NOT NULL,
  FOREIGN KEY (purchase_id) REFERENCES purchases (id),
  FOREIGN KEY (product_id) REFERENCES products (id)
);

INSERT INTO users(id, name, email, password)
VALUES
("U001", "TEEMO", "teemo@email.com", "T01234"),
("U002", "APHELIOS", "aphelios@email.com", "A54321");
