import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      console.log("Error Occured");
      console.log(e.name);
      if (e.name === "StructError") {
        res.status(400).send({ message: e.message });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

app.get(
  "/users",
  asyncHandler(async (req, res) => {
    const { offset = 0, limit = 10, order = "newtest" } = req.query;
    let orderBy;
    switch (order) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
      default:
        orderBy = { createdAt: "desc" };
    }

    const users = await prisma.user.findMany({
      orderBy: orderBy,
      skip: parseInt(offset),
      take: parseInt(limit),
    });
    res.send(users);
  })
);

app.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.send(user);
  })
);

app.post(
  "/users",
  asyncHandler(async (req, res) => {
    assert(req.body, CreateUser);
    const user = await prisma.user.create({ data: req.body });
    res.status(201).send(user);
  })
);

app.patch(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    assert(req.body.patchUser);
    const user = await prisma.user.update({
      where: { id },
      data: req.body,
    });
    res.send(user);
  })
);

app.delete(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id },
    });
    res.send("Success delete");
  })
);

// products
app.get(
  "/products",
  asyncHandler(async (req, res) => {
    const { offset = 0, limit = 10, order = newest, category } = req.query;
    let orderBy;
    switch (order) {
      case "PriceLowest":
        orderBy = { price: "asc" };
        break;
      case "PriceHighest":
        orderBy = { price: "desc" };
        break;
      case "oldest":
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
      default:
        orderBy = { createdAt: "desc" };
    }
    const where = category ? { category } : {};
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip: pareseInt(offset),
      take: parseInt(limit),
    });
    res.send(products);
  })
);
app.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
    });
  })
);

app.post(
  "/products",
  asyncHandler(async (req, res) => {
    assert(req.body);
    const product = await prisma.product.create({
      data: req.body,
    });
    res.send(product);
  })
);

app.patch(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await prisma.product.update({
      where: { id },
      data: req.body,
    });
    res.send(products);
  })
);

app.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.products.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server Started on ${process.env.PORT}`)
);
