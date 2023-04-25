import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'
import { TProductsDB, TUserDB } from './types'
import { error } from 'console'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message:"Pong!"})
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

app.get("/users", async (req: Request, res: Response) => {
    try {
        const searchTerm = req.query.q as string | undefined

        if (searchTerm === undefined ) {
            const result = await db("users")
            res.status(200).send(result)
        }else {
            const result = await db("users").where("name", "LIKE", `%${searchTerm}%`)
            res.status(200).send(result)
        }

        
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post("/users", async (req: Request, res: Response) => {
    try {
        const {id, name, email, password} = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (id.length < 4) {
            res.status(400)
            throw new Error("'id' deve possuir pelo menos 4 caracteres")
        }

        if (typeof name !== "string") {
            res.status(400)
            throw new Error("'name' deve ser string")
        }

        if (name.length < 2) {
            res.status(400)
            throw new Error("'name' deve possuir pelo menos 2 caracteres")
        }

        if (typeof email !== "string") {
            res.status(400)
            throw new Error("'email' deve ser string")
        }

        if (email.length < 4) {
            res.status(400)
            throw new Error("'email' deve possuir pelo menos 4 caracteres")
        }

        if (typeof password !== "string") {
            res.status(400)
            throw new Error("'password' deve ser string")
        }

        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
			throw new Error("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
		}

        const [ userIdAlreadyExists ]: TUserDB[] | undefined[] = await db("users").where({ id })

        if (userIdAlreadyExists) {
            res.status(400)
            throw new Error("'id' já existe")
        }
        const [ userEmailAlreadyExists ]: TUserDB[] | undefined[] = await db("users").where({ email })

        if (userEmailAlreadyExists) {
            res.status(400)
            throw new Error("'email' já existe")
        }

        const newUser: TUserDB = {
            id,
            name,
            email,
            password
        }

        await db("users").insert(newUser)
        res.status(201).send({
            message: "Usuario criado com sucesso",
            user: newUser
        })
        
         
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

app.post("/products", async (req: Request, res: Response) => {
    try {
        const id = req.body.id;
        const name = req.body.name;
        const price = req.body.price as number;
        const description = req.body.description;
        const image_url = req.body.image_url;

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (id.length < 4) {
            res.status(400)
            throw new Error("'id' deve possuir pelo menos 4 caracteres")
        }

        if (typeof name !== "string") {
            res.status(400)
            throw new Error("'name' deve ser string")
        }

        if (name.length < 2) {
            res.status(400)
            throw new Error("'name' deve possuir pelo menos 2 caracteres")
        }

        if (typeof image_url !== "string") {
            res.status(400)
            throw new Error("'image_url' deve ser string")
        }
        if (typeof price !== "number") {
            res.status(400)
            throw new Error("'price' deve ser number")
        }

    

    

        if (typeof description !== "string") {
            res.status(400)
            throw new Error("'description' deve ser string")
        }

        

        const [ productsIdAlreadyExists ]: TProductsDB[] | undefined[] = await db("products").where({ id })

        if (productsIdAlreadyExists) {
            res.status(400)
            throw new Error("'id' já existe")
        }
        

        const newProduct: TProductsDB = {
            id,
            name,
            price,
            description,
            image_url
        }

        await db("products").insert(newProduct)
        res.status(201).send({
            message: "Produto criado com sucesso",
            products: newProduct
        })
        
         
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

app.get("/products", async (req: Request, res: Response) => {
    try {
        const searchTerm = req.query.q as string | undefined

        if (searchTerm === undefined ) {
            const result = await db("products")
            res.status(200).send(result)
        }else {
            const result = await db("products").where("name", "LIKE", `%${searchTerm}%`)
            res.status(200).send(result)
        }

        
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

app.put("/products/:id", async (req: Request, res: Response) => {
    try {

        const idToEdit = req.params.id;

        const newId = req.body.id;
        const newName = req.body.name;
        const newPrice = req.body.price as number;
        const newDescription = req.body.description;
        const newImage_url = req.body.image_url;
        

        if(newId !== undefined){
            if (typeof newId !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }
    
            if (newId.length < 4) {
                res.status(400)
                throw new Error("'id' deve possuir pelo menos 4 caracteres")
            }
        }

        if(newName !== undefined){
            if (typeof newName !== "string") {
                res.status(400)
                throw new Error("'name' deve ser string")
            }
    
            if (newName.length < 2) {
                res.status(400)
                throw new Error("'name' deve possuir pelo menos 2 caracteres")
            }
        }

        if(newPrice !== undefined){
            if (typeof newPrice !== "number") {
                res.status(400)
                throw new Error("'price' deve ser number")
            }
        }

        if(newDescription !== undefined){
            if (typeof newDescription !== "string") {
                res.status(400)
                throw new Error("'description' deve ser string")
            }
        }

        if(newImage_url !== undefined){ 
            if (typeof newImage_url !== "string") {
            res.status(400)
            throw new Error("'image_url' deve ser string")
        }
    }

        
    
    const [ products ]: TProductsDB[] | undefined[] = await db("products").where({ id: idToEdit })

        if (!products) {
            res.status(404)
            throw new Error("'id' não encontrado")
        }
        

        const newProduct: TProductsDB = {
            id: newId || products.id,
            name: newName || products.name,
            price: newPrice || products.price,
            description: newDescription || products.description,
            image_url: newImage_url || products.image_url
        }

        await db("products").update(newProduct).where({ id: idToEdit})
        res.status(200).send({
            message: "Produto atualizado com sucesso",
            products: newProduct
        })
        
         
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

app.post("/purchases", async (req: Request, res: Response) => {
    try {

        const purchase_id = Math.floor(Date.now() * Math.random()).toString(36);

        const { buyer, buyer_id, total_price, productId, quantity } = req.body;

        if (buyer === null || buyer === undefined || buyer_id === null || buyer_id === undefined || total_price === null || total_price === undefined || productId === null || productId === undefined || quantity === null || quantity === undefined) {
            return res.sendStatus(400).send("Preencha todos os campos para efetuar a compra.");
        }

    

        const [findBuyer] = await db("users").where({ id: buyer_id });

        if (!findBuyer || findBuyer.length === 0) {
            res.status(400)
            throw new Error("O 'buyer' deve corresponder à um 'id' de um usuário cadastrado.");
        };

        if (!total_price) {
            res.status(400);
            throw new Error("Total do produto inexistente, por favor digite um total válido.")
        };

        if (typeof total_price !== "number") {
            res.status(400);
            throw new Error("o total do produto tem que ser um número.")
        };

        await db("purchases").insert({ id: purchase_id, buyer: buyer, buyer_id: buyer_id, total_price: total_price });

        await db("purchases_products").insert({ purchase_id: purchase_id, product_id: productId, quantity: quantity });

        res.status(201).send("Compra realizada com sucesso!");

    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500)
        };

        res.send(error.message);
    };
});

app.delete("/purchases/:id", async (req: Request, res: Response) => {

    try {
        const idToDelete = req.params.id;
        const [searchProduct] = await db("purchases").where({ id: idToDelete });

        if (searchProduct) {
            await db.delete().from("purchases_products").where({ purchase_id: idToDelete });
            await db.delete().from("purchases").where({ id: idToDelete });

        } else {
            res.status(404)
            throw new Error("Compra não encontrada ou já deletada anteriormente. Verifique o 'id'.")
        };

        res.status(200).send("Compra deletada com sucesso");

    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500)
        };

        res.send(error.message);
    };
});

app.get("/users/:id/purchases", async (req: Request, res: Response) => {

    try {
        const idToSearch: string = req.params.id;
        const [searchPurchases] = await db("purchases").where({ id: idToSearch });

        if (searchPurchases) {
                const products = await db("purchases_products")
                .select(
                    "products.id as productId",
                    "products.name as productName",
                    "products.price as productPrice",
                    "products.description AS productDescription",
                    "products.image_url AS imageUrl",
                    "purchases_products.quantity AS quantity"
                )
                .join(
                    "purchases",
                    "purchases_products.purchase_id",
                    "=",
                    "purchases.id"
                )
                .join(
                    "products",
                    "purchases_products.product_id",
                    "=",
                    "products.id"
                ).where("purchases.buyer_id", "=", `${searchPurchases.buyer_id}`)

                console.log(products)

            res.status(200).send({ ...searchPurchases, products })

        } else {
            res.status(400)
            throw new Error("'id' incorreto. Insira um 'id' de compra, iniciado com 'PC' seguido de 3 numeros, para realizar uma nova busca.")
        }

    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500)
        };

        res.send(error.message);
    };
});