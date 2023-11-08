import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { array, func, object } from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { createItem, updateItem } from "../api/api";
import { PRODUCTS } from "../api/routes";

function ProductForm(props) {
  const { categories, setCurrentView, mutate, editProduct, setEditProduct } =
    props;

  useEffect(() => {
    if (editProduct) {
      document.title = `Ubah Produk - Bangsa`;
    } else {
      document.title = `Tambah Produk - Bangsa`;
    }
  }, [editProduct]);

  const schema = yup.object({
    name: yup.string().required("Required"),
    categoryId: yup.number().required("Required"),
    price: yup.number().required("Required"),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      categoryId: 0,
      price: 0,
      minOrder: 1,
      image: "",
      createdAt: 0,
    },
    resolver: yupResolver(schema),
  });

  const { register, formState, handleSubmit, reset, watch } = form;
  const { errors } = formState;

  useEffect(() => {
    if (editProduct) {
      reset({
        name: editProduct.name,
        categoryId: editProduct.categoryId,
        price: editProduct.price,
        minOrder: editProduct.minOrder,
        image: editProduct.image,
        createdAt: editProduct.createdAt,
      });
    }

    return () =>
      reset({
        name: "",
        categoryId: 0,
        price: 0,
        minOrder: 1,
        image: "",
        createdAt: 0,
      });
  }, [editProduct, reset]);

  useEffect(() => {
    const subscription = watch((values) => {
      console.log("watch", values);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const imgTagRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (event) => {
    const [image] = event.target.files;

    if (image) {
      setImageFile(image);
      imgTagRef.current.src = URL.createObjectURL(image);
      imgTagRef.current.onLoad = () =>
        URL.revokeObjectURL(imgTagRef.current.src);
    }
  };

  // https://www.filestack.com/fileschool/react/react-file-upload/
  const uploadImage = () => {
    const UPLOAD_URL = "https://api.imgbb.com/1/upload";
    const API_KEY = "0df22f61720b286ac580b7cab12ed3ae";

    const body = new FormData();
    body.set("key", API_KEY);
    body.append("image", imageFile);

    return axios({
      method: "post",
      url: UPLOAD_URL,
      headers: {
        "content-type": "multipart/form-data",
      },
      onUploadProgress: function (progressEvent) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        setUploadProgress(percentCompleted);
      },
      data: body,
    });
  };

  const onSubmit = async (data) => {
    try {
      let imageUri = "";
      if (imageFile) {
        const response = await uploadImage();
        imageUri = response.data.data.url;
        console.log(imageUri);
      }

      const updatedData = imageUri === "" ? data : { ...data, image: imageUri };

      if (editProduct) {
        const editedProduct = await updateItem(
          `${PRODUCTS}/${editProduct.id}`,
          updatedData,
        );
        mutate();
        console.log(editedProduct);
      } else {
        const product = await createItem(PRODUCTS, updatedData);
        mutate();
        console.log(product);
      }
    } catch (error) {
      console.error("Error posting product: ", error);
    } finally {
      setCurrentView(1);
      setImageFile(null);
      setUploadProgress(0);
      if (editProduct) {
        setEditProduct(null);
      }
    }
  };

  const handleCancel = () => {
    setCurrentView(1);
    setImageFile(null);
    setUploadProgress(0);
    if (editProduct) {
      setEditProduct(null);
    }
  };

  return (
    <>
      <form
        className="grid grid-cols-1 md:grid-cols-2"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="card w-full shadow-xl">
          <div className="card-body p-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nama Produk</span>
                <span className="label-text-alt text-error">
                  {errors.name?.message}
                </span>
              </label>
              <input
                type="text"
                placeholder="Nama Produk"
                className="input input-bordered w-full"
                {...register("name")}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Kategori</span>
                <span className="label-text-alt text-error">
                  {errors.categoryId?.message}
                </span>
              </label>
              <select
                className="select select-bordered w-full"
                {...register("categoryId", { valueAsNumber: true })}
              >
                <option disabled value="0">
                  Kategori
                </option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Harga Produk</span>
                <span className="label-text-alt text-error">
                  {errors.price?.message}
                </span>
              </label>
              <input
                type="text"
                placeholder="Harga Produk"
                className="input input-bordered w-full"
                {...register("price", { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>
        <div className="card w-full shadow-xl">
          <div className="card-body p-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Gambar Produk</span>
              </label>
              <input
                accept="image/*"
                type="file"
                className="file-input file-input-bordered w-full"
                onChange={handleChange}
              />
            </div>
            <div className="form-control">
              <div className="relative flex flex-col items-center justify-center overflow-hidden pb-2">
                <img ref={imgTagRef} className="object-cover"></img>
                <div className="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full justify-end"></div>
              </div>
              <progress
                className="progress progress-primary"
                value={uploadProgress}
                max="100"
              ></progress>
            </div>
            <div className="mt-auto">
              <button type="submit" className="btn btn-primary btn-block">
                {editProduct ? "Ubah" : "Tambah"}
              </button>
              <button
                type="button"
                className="btn btn-error btn-block mt-2"
                onClick={handleCancel}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

ProductForm.propTypes = {
  categories: array,
  setCurrentView: func,
  mutate: func,
  editProduct: object,
  setEditProduct: func,
};

export default ProductForm;
