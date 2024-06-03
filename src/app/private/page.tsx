"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Button,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { headers } from "next/headers";
import Navbar from "../components/navbar";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const { register, handleSubmit, reset } = useForm<Product>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<Product[]>(
        "http://localhost:3000/api/products"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setOpenEditModal(true);
    reset(product);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
  };

  const handleEditCloseModal = () => {
    setOpenEditModal(false);
    setSelectedProduct(null);
  };

  const onSubmit: SubmitHandler<Product> = async (data) => {
    try {
      data.price = parseFloat(data.price.toString());
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const response = await axios.patch(
        `http://localhost:3000/api/products/${selectedProduct?.id}`,
        data,
        headers
      );
      if (response.status === 200) {
        fetchData();
        handleEditCloseModal();
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      await axios.delete(
        `http://localhost:3000/api/products/${selectedProduct?.id}`,
        headers
      );
      setDeleteConfirmationOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleAddProduct = () => {
    setOpenModal(true);
  };

  const onSubmitCreate: SubmitHandler<Product> = async (data) => {
    try {
      data.price = parseFloat(data.price.toString());

      const headers = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const response = await axios.post<Product>(
        "http://localhost:3000/api/products",
        data,
        headers
      );
      if (response.status === 201) {
        setOpenModal(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <Button variant="contained" onClick={handleAddProduct}>
        Add Product
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="product table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ margin: "20px" }}>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.createdAt}</TableCell>
                <TableCell>{product.updatedAt}</TableCell>
                <TableCell>{product.userId}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => handleOpenModal(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteProduct(product)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* EDIT */}
      <Modal
        open={openEditModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: 400,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            Edit Product
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register("name")}
              label="Name"
              fullWidth
              margin="normal"
            />
            <TextField
              {...register("description")}
              label="Description"
              fullWidth
              margin="normal"
            />
            <TextField
              {...register("price")}
              type="decimal"
              label="Price"
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Save Changes
            </Button>
          </form>
        </Box>
      </Modal>

      {/* DELETE */}
      <Modal
        open={deleteConfirmationOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-description"
      >
        <Box
          sx={{
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: 400,
          }}
        >
          <Typography
            id="delete-confirmation-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Are you sure you want to delete this product?
          </Typography>
          <Button variant="contained" onClick={handleDeleteConfirmation}>
            Yes
          </Button>
          <Button variant="contained" onClick={handleCancelDelete}>
            No
          </Button>
        </Box>
      </Modal>

      {/* ADD */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: 400,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            Add New Product
          </Typography>
          <form onSubmit={handleSubmit(onSubmitCreate)}>
            <TextField
              {...register("name")}
              label="Name"
              fullWidth
              margin="normal"
            />
            <TextField
              {...register("description")}
              label="Description"
              fullWidth
              margin="normal"
            />
            <TextField
              {...register("price")}
              type="decimal"
              label="Price"
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Add Product
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default ProductPage;
