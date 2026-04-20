import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const API = "https://custom-landing-page-server.vercel.app/api/leads";
  // let API = "http://localhost:5000/api/leads";
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    platform: "Amazon",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState("");

  // GET LEADS
  const fetchLeads = async () => {
    // let url = "http://localhost:5000/api/leads";
    // let url = "https://custom-landing-page-server.vercel.app/api/leads";
    let url = API

    if (filter) {
      url += `?platform=${filter}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setLeads(data);
  };

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  // VALIDATION
  const validate = () => {
    const e = {};

    if (!/^\d{10}$/.test(form.phone)) {
      e.phone = "Phone must be 10 digits";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Invalid email";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // CREATE LEAD
  const submit = async (ev) => {
    ev.preventDefault();

    if (!validate()) return;
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    alert("Lead Submitted");

    setForm({
      name: "",
      phone: "",
      email: "",
      platform: "Amazon",
      message: "",
    });

    fetchLeads();
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    await fetch(`${API}/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    fetchLeads();
  };

  // DELETE LEAD
  const deleteLead = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this lead?"
    );

    if (!confirmDelete) return;

    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    fetchLeads();
  };

  return (
    <div>
      {/* HEADER */}
      <header className="header">
        <h2>Seller Rocket</h2>

        <nav>
          <a href="#">Home</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <h1>Grow Your Online Sales Faster</h1>
        <p>
          Experts for Amazon, Shopify and
          WordPress growth.
        </p>

        <button
          onClick={() =>
            document
              .getElementById("contact")
              .scrollIntoView({
                behavior: "smooth",
              })
          }
        >
          Get Started
        </button>
      </section>

      {/* SERVICES */}
      <section
        id="services"
        className="cards"
      >
        <div className="card">
          Amazon Management
        </div>

        <div className="card">
          Marketplace Growth Consulting
        </div>

        <div className="card">
          Catalog & Ads Optimization
        </div>
      </section>

      {/* FORM */}
      <section
        id="contact"
        className="formWrap"
      >
        <form onSubmit={submit}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
          />
          {errors.phone && (
            <small>{errors.phone}</small>
          )}

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />
          {errors.email && (
            <small>{errors.email}</small>
          )}

          <select
            value={form.platform}
            onChange={(e) =>
              setForm({
                ...form,
                platform: e.target.value,
              })
            }
          >
            <option>Amazon</option>
            <option>Flipkart</option>
            <option>Shopify</option>
            <option>WordPress</option>
          </select>

          <textarea
            placeholder="Message"
            value={form.message}
            onChange={(e) =>
              setForm({
                ...form,
                message: e.target.value,
              })
            }
          ></textarea>

          <button>Submit</button>
        </form>
      </section>

      {/* ADMIN */}
      <section className="admin">
        <h2>Admin Leads</h2>

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >
          <option value="">
            All Platforms
          </option>
          <option value="Amazon">
            Amazon
          </option>
          <option value="Flipkart">
            Flipkart
          </option>
          <option value="Shopify">
            Shopify
          </option>
          <option value="WordPress">
            WordPress
          </option>
        </select>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Platform</th>
              <th>Status</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.phone}</td>
                <td>{lead.email}</td>
                <td>{lead.platform}</td>

                {/* PATCH */}
                <td>
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      updateStatus(
                        lead._id,
                        e.target.value
                      )
                    }
                  >
                    <option>New</option>
                    <option>
                      Contacted
                    </option>
                    <option>
                      Converted
                    </option>
                    <option>
                      Rejected
                    </option>
                  </select>
                </td>

                {/* DELETE */}
                <td>
                  <button
                    onClick={() =>
                      deleteLead(
                        lead._id
                      )
                    }
                    style={{
                      background:
                        "red",
                      color:
                        "white",
                      border:
                        "none",
                      padding:
                        "8px 12px",
                      cursor:
                        "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* FOOTER */}
      <footer>
        Seller Rocket |
        hello@sellerrocket.com |
        +91 9876543210
      </footer>
    </div>
  );
}