import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import styles from "../../styles/Admin.module.css";

const Index = ({ orders, products }) => {
  const [pizzaList, setPizzaList] = useState(products);
  const [orderList, setOrderList] = useState(orders);

  const status = ["preparing", "on the way", "delivered"];
  const handleDelete = async (id) => {
    console.log(id);
    try {
      const res = await axios.delete(
        "http://localhost:3000/api/products/" + id
      );
      setPizzaList(pizzaList.filter((pizza) => pizza._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatus = async (id) => {
    //get the status of the order
    const item = orderList.filter((order) => order._id === id)[0];
    const currentStatus = item.status;

    try {
      const res = await axios.put("http://localhost:3000/api/orders/" + id, {
        status: currentStatus + 1,
      });
      console.log(res.data);
      setOrderList([
        //add the updated data(res) and the remove the previous Order data using filter
        res.data,
        ...orderList.filter((order) => order._id !== id),
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <h1>Products</h1>
        <table>
          <tbody>
            <tr className={styles.trTitle}>
              <th>Image</th>
              <th>ID</th>
              <th>Title</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </tbody>
          {pizzaList.map((product) => (
            <tbody key={product._id}>
              <td>
                <Image
                  src={product.img}
                  width={50}
                  height={50}
                  objectFit="cover"
                  alt="Pizza"
                />
              </td>
              <td>{product._id.slice(0, 5)}...</td>
              <td>{product.title}</td>
              <td>${product.prices[0]}</td>
              <td>
                {" "}
                <button className={styles.button}>Edit</button>
                <button
                  className={styles.button}
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>{" "}
              </td>
            </tbody>
          ))}
        </table>
      </div>
      <div className={styles.item}>
        <h1>Orders</h1>
        <table>
          <tbody>
            <tr className={styles.trTitle}>
              <th>ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </tbody>
          {orderList.map((order) => (
            <tbody key={order._id}>
              <td>{order._id.slice(0, 5)}...</td>
              <td>{order.customer}</td>
              <td>${order.total}</td>
              <td>
                {order.method === 0 ? <span>cash</span> : <span>paid</span>}{" "}
              </td>
              <td>{status[order.status]} </td>
              <td>
                {" "}
                <button onClick={() => handleStatus(order._id)}>
                  Next Stage
                </button>
              </td>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const myCookie = ctx.req?.cookies || "";
  if (myCookie.token !== process.env.TOKEN) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }
  const productRes = await axios.get("http://localhost:3000/api/products");
  const orderRes = await axios.get("http://localhost:3000/api/orders");

  return {
    props: {
      orders: orderRes.data,
      products: productRes.data,
    },
  };
};

export default Index;
