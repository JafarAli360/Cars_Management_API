import db from "../models/index.js";
import jwt from "jsonwebtoken";
const Cars = db.Cars;
export const getCars = async (req, res) => {
  if (req.user.roles == "member") {
    res.status(401).json({
      status: "Unauthorized",
      message: "Anda bukan SuperAdmin / Admin",
    });
    return;
  }
  const cars = await Cars.findAll({
    attributes: ["id", "name", "price", "size", "createdBy", "updatedBy", "deletedBy"],
  });
  res.json(cars);
};

export const getCarsById = async (req, res) => {
  const { id } = req.params;
  const cars = await Cars.findOne({
    where: { id: id },
  });
  res.json(cars);
};

export const createCars = async (req, res) => {
  if (req.user.roles == "member") {
    res.status(401).json({
      status: "Unauthorized",
      message: "Anda bukan SuperAdmin / Admin",
    });
    return;
  }
  const { name, price, size } = req.body;
  try {
    await Cars.create({
      name: name,
      price: price,
      size: size,
      createdBy: req.user.roles,
    });
    return res.status(200).json({
      success: true,
      message: "Mobil Berhasil ditambahkan",
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateCars = async (req, res) => {
  if (req.user.roles == "member") {
    res.status(401).json({
      status: "Unauthorized",
      message: "Anda bukan SuperAdmin / Admin",
    });
    return;
  }
  const { id } = req.params;
  const { name, price, size } = req.body;
  try {
    await Cars.update(
      { name: name, price: price, size: size, updatedBy: req.user.email },
      {
        where: { id: id },
      }
    );
    return res.status(200).json({
      success: true,
      message: "Mobil Berhasil diupdate",
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteCars = async (req, res) => {
  if (req.user.roles == "member") {
    res.status(401).json({
      status: "Unauthorized",
      message: "Anda bukan SuperAdmin / Admin",
    });
    return;
  }
  const { id } = req.params;
  const dataBeforeDelete = await Cars.findOne({
    where: { id: id },
  });
  // if(tokenUser.role !="superadmin"){res.json()}
  const parsedDataProfile = JSON.parse(JSON.stringify(dataBeforeDelete));

  if (!parsedDataProfile) {
    return res.status(400).json({
      success: false,
      message: "Cars doesn't exist or has been deleted!",
    });
  }

  await Cars.destroy({
    where: { id },
  });

  return res.status(200).json({
    success: true,
    message: "Delete Data Successfully",
  });
};
