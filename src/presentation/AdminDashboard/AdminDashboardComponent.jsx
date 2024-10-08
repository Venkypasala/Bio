import React, { useState, useEffect } from "react";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  OverlayTrigger,
  Button,
  Modal,
  Toast,
} from "react-bootstrap";
import BioOrganicLogo from "../../infrastructure/assets/images/bio-logo.png";
import { AiOutlineQuestionCircle } from "react-icons/ai";

import { BsSearch } from "react-icons/bs";

import { GiSettingsKnobs } from "react-icons/gi";
import ScaleLoader from "react-spinners/ScaleLoader";
import { Table, ITableProps, kaReducer, useTable } from "ka-table";
import { DataType, EditingMode, SortingMode } from "ka-table/enums";
import { MdEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { connect } from "react-redux";
import {
  getListOfProduct,
  deleteListOfProductList,
  addToLatest,
  isVisibleProduct,
  searchProduct,
  getProductById,
  productCategory,
} from "../../application/services/actions/auth";
import { MdOutlineCancel } from "react-icons/md";
import SearchModal from "../../infrastructure/components/SearchModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import AdminHeaderComponent from "../AdminHeader/AdminHeaderComponent";
import { ActionType } from "ka-table/enums";
function AdminDashboardComponent(props) {
  const [search, setSearch] = useState("");
  const [allProductList, setAllProductList] = useState([]);
  const [status, setStatus] = useState(false);
  const [show, setShow] = useState(false);
  const [showA, setShowA] = useState(false);
  const [showlatest, setShowlatest] = useState(false);
  const [showUpdateAll, setShowUpdateAll] = useState(false);
  const [showVisible, setShowVisible] = useState(false);
  const [showUpdateConfirm, setshowUpdateConfirm] = useState(false);
  const [show1, setShow1] = useState(false);
  const navigate = useNavigate();
  const [selectedProduct, setSelectedproduct] = useState(null);
  const [selectedProductDelete, setSelectedproductDelete] = useState(null);
  const [selectedAddToLatestRows, setSelectedAddToLatestRows] = useState([]);
  const [selectedVisibilityRows, setSelectedVisibilityRows] = useState([]);
  const [deletedProduct, setDeletedProduct] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [newlySelectedRows, setNewlySelectedRows] = useState([]);
  const [newlyDeselectedRows, setNewlyDeselectedRows] = useState([]);
  const [newlySelectedVisibilityRows, setNewlySelectedVisibilityRows] =
    useState([]);
  const [newlyDeselectedVisibilityRows, setNewlyDeselectedVisibilityRows] =
    useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [ManuallyCleared, setManuallyCleared] = useState(true);
  const table = useTable({
    onDispatch: async (action) => {
      if (action.type === ActionType.UpdatePageIndex) {
        setPageIndex(action.pageIndex);
      }
    },
  });
  const rowPropsGetter = (rowData, rowIndex) => {
    const rowClassName =
      rowData === hoveredRow ? "hovered-row" : "hovered-row2";

    return {
      className: rowClassName,
      onMouseEnter: () => handleRowHover(rowData),
      onMouseLeave: () => handleRowHover(null),
    };
  };

  const handleRowHover = (rowData) => {
    setHoveredRow(rowData);
  };

  const toggleShowA = () => setShowA(!showA);

  const columns = [
    { key: "catId", title: "CAT#", style: { textAlign: "center" } },
    { key: "casNumber", title: "CAS#", style: { textAlign: "center" } },
    {
      key: "chemicalName",
      title: "CHEMICAL NAME",
      style: { textAlign: "center" },
    },
    {
      key: "OPTIONS",
      title: "OPTIONS",
      dataType: DataType.String,
      style: { textAlign: "center" },
    },
    {
      key: "ADD_TO_LATEST",
      title: "ADD TO LATEST",
      style: { textAlign: "center" },
      dataType: DataType.Boolean,
      editor: false,
    },
    {
      key: "DISAPPEAR",
      title: "DISAPPEAR",
      style: { textAlign: "center" },
      dataType: DataType.Boolean,
      editor: false,
    },
  ];

  const handleRowSelect = (rowData) => {
    if (!selectedAddToLatestRows.some((row) => row.id === rowData.id)) {
      setSelectedAddToLatestRows([...selectedAddToLatestRows, rowData]);
    }
  };
  const handleVisibilityRowSelect = (rowData) => {
    if (!selectedVisibilityRows.some((row) => row.id === rowData.id)) {
      setSelectedVisibilityRows([...selectedVisibilityRows, rowData]);
    }
  };
  const accessToken = localStorage.getItem("accessToken");
  const init = async () => {
    const payload = {
      pageNumber: 1,
      pageSize: 100,
      search: "",
      sortField: "",
      sortDirection: "",
      filterName: "",
      filterValue: "",
      category: "",
      multipleFilters: [
        {
          filterName: "",
          filterValue: 0,
        },
      ],
    };
    setStatus(true);
    props
      .getListOfProduct(payload, accessToken)
      .then((res) => {
        setStatus(false);

        let selectedAddToLatest = res?.data.result.filter(
          (item) => item.addToLatest === true
        );
        let selectedVisibility = res?.data.result.filter(
          (item) => item.isVisible === true
        );
        let deletedProduct = res?.data.result.filter(
          (item) => item.isDelete === false
        );

        setSelectedAddToLatestRows(selectedAddToLatest);
        setSelectedVisibilityRows(selectedVisibility);
        setDeletedProduct(deletedProduct);
        setAllProductList(deletedProduct ? deletedProduct : []);
      })
      .catch((error) => {
        setStatus(false);
        setAllProductList([]);
      });
  };

  const deleteProduct = async (productId) => {
    const payload = {
      productIds: [productId],
    };

    setStatus(true);
    props
      .deleteListOfProductList(payload, accessToken)
      .then((res) => {
        setStatus(false);

        init();
      })
      .catch((error) => {});
  };
  const searchApiCall = async (value) => {
    const payload = {
      pageNumber: 1,
      pageSize: 100,
      search: value,
      sortField: "",
      sortDirection: "",
      filterName: "",
      filterValue: "",
      multipleFilters: [
        {
          filterName: "",
          filterValue: 0,
        },
      ],
    };

    setStatus(true);
    props
      .searchApi(payload)
      .then((res) => {
        setStatus(false);
        setAllProductList(res?.data?.result ? res?.data?.result : []);
      })
      .catch((error) => {
        setStatus(false);
        setAllProductList([]);
      });
  };
  const fetchProductById = (id) => {
    const productId = id;
    props
      .getProductBy(productId)
      .then((res) => {
        setAllProductList([]);
        navigate("/AdminDashboard/AddNewProduct", {
          state: { data: res?.data, screen: "Edit" },
        });
      })
      .catch((err) => {});
  };

  const addToLatestApi = () => {
    let latestSelectedIDS = [];
    let latestDeselectedIDS = [];
    newlySelectedRows && newlySelectedRows.length
      ? newlySelectedRows.map((item) => {
          latestSelectedIDS.push(item.id);
        })
      : null;
    newlyDeselectedRows && newlyDeselectedRows.length
      ? newlyDeselectedRows.map((item) => {
          latestDeselectedIDS.push(item.id);
        })
      : null;

    const payload = {
      ids: latestSelectedIDS,
      deSelectedIds: latestDeselectedIDS,
    };
    props
      .addToLatest(payload)
      .then((res) => {
        setSelectedAddToLatestRows([]);
        setAllProductList([]);
        init();
      })
      .catch((error) => {
        toast.error(error?.reason || "No Match Found!!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };

  const visibilityApi = () => {
    let latestSelectedVisibleIDS = [];
    let latestDeselectedVisibleIDS = [];
    newlySelectedVisibilityRows && newlySelectedVisibilityRows.length
      ? newlySelectedVisibilityRows.map((item) => {
          latestSelectedVisibleIDS.push(item.id);
        })
      : null;
    newlyDeselectedVisibilityRows && newlyDeselectedVisibilityRows.length
      ? newlyDeselectedVisibilityRows.map((item) => {
          latestDeselectedVisibleIDS.push(item.id);
        })
      : null;

    const payload = {
      ids: latestSelectedVisibleIDS,
      deSelectedIds: latestDeselectedVisibleIDS,
    };
    props
      .visibilityApi(payload, accessToken)
      .then((res) => {
        setSelectedAddToLatestRows([]);
        setAllProductList([]);
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error?.reason || "No Match Found!!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };
  const handleClearInput = () => {
    setSearch("");
    setManuallyCleared(true);
    setSelectedproduct();
  };
  useEffect(() => {
    if (selectedProduct) {
      setAllProductList([selectedProduct]);
    } else if (!search) {
      init();
    } else {
      searchApiCall(search);
    }
    init();
  }, [search]);

  return (
    <Container fluid className="main-div-admin" sm={12} lg={12}>
      <AdminHeaderComponent />
      <Row className="sec1 align-items-center">
        <Row>
          <Col sm={0} md={0} lg={1} style={{ backgroundColor: "#efefef" }} />
          <Col md={12} sm={12} lg={7}>
            <div className="search-container-admin d-flex d-row">
              <AiOutlineQuestionCircle
                size={28}
                className="info-btn-admin"
                onClick={() => {
                  toggleShowA();
                }}
              />
              <input
                className="search-box-admin"
                placeholder="Enter CAT#,CAS#,Chemical Name or Mol Formula"
                onChange={(e) => {
                  setSelectedproduct(null);
                  setSearch(e.target.value),
                    e.target.value.length >= 3
                      ? searchApiCall(e.target.value)
                      : setShow(false);
                  e.target.value === "" ? setShow(false) : setShow(true);
                }}
                value={
                  selectedProduct
                    ? selectedProduct.length > 50
                      ? `${selectedProduct.slice(0, 50)}...`
                      : selectedProduct
                    : search
                }
                onblur={handleClearInput}
              />
              {show && (
                <>
                  <MdOutlineCancel
                    type="button"
                    color="black"
                    size={20}
                    onClick={() => {
                      setShow(false);
                      setSearch("");
                    }}
                    className="close-btn-admin"
                  />
                  {/* <div className="vl-admin" /> */}
                </>
              )}
              <BsSearch
                size={25}
                className="search-btn-admin"
                onClick={() => {
                  searchApiCall(search);
                }}
              />
            </div>
            <Toast
              className="cross-button-admin"
              show={showA}
              onClose={toggleShowA}
            >
              <Toast.Body>
                <Col style={{ display: "flex", justifyContent: "flex-end" }}>
                  <MdOutlineCancel
                    type="button"
                    color="black"
                    size={15}
                    onClick={() => {
                      toggleShowA();
                    }}
                  />
                </Col>
                <Row
                  className="justify-content-center"
                  style={{ fontSize: "12px", paddingTop: "0.5rem" }}
                >
                  <p>
                    Type the keyword in the search bar and click the "Search
                    icon" or press "Enter" on your keyboard
                  </p>
                  <span
                    className="got-admin"
                    style={{ textAlign: "center" }}
                    onClick={() => {
                      toggleShowA();
                    }}
                  >
                    Got It
                  </span>
                </Row>
              </Toast.Body>
            </Toast>
            {show ? (
              <SearchModal setShow={setShow}>
                {status ? (
                  <ScaleLoader
                    color="#a3238e"
                    height={"1rem"}
                    style={{ marginLeft: "20rem" }}
                  />
                ) : null}
                <div style={{ textAlign: "left" }}>
                  {allProductList && allProductList.length ? (
                    allProductList.map((item) => {
                      return (
                        <div key={item.id}>
                          <h11
                            onClick={() => {
                              setSelectedproduct(item.chemicalName);
                              searchApiCall(item.chemicalName);
                              setShow(false);
                            }}
                          >
                            {item.chemicalName}
                          </h11>
                        </div>
                      );
                    })
                  ) : (
                    <h3>No Record Found!</h3>
                  )}
                </div>
              </SearchModal>
            ) : null}
          </Col>
          <Col
            md={12}
            sm={12}
            lg={4}
            style={{ marginTop: "0.3rem", marginLeft: "-14px" }}
          >
            <button
              className="addnew-btn mx-2 text-center"
              onClick={() => {
                navigate("/AdminDashboard/AddNewProduct", {
                  state: { screen: "Add New" },
                });
              }}
            >
              Add New
            </button>
            <button
              className="cat-btn mx-2 text-center"
              onClick={() => {
                navigate("/AdminDashboard/category");
              }}
            >
              Category
            </button>
            <button
              id="updatebtn"
              className="update-btn mx-2 text-center"
              onClick={() => {
                newlySelectedRows.length === 0 &&
                newlyDeselectedRows.length === 0
                  ? newlySelectedVisibilityRows.length === 0 &&
                    newlyDeselectedVisibilityRows.length === 0
                    ? toast.error("Please select products", {
                        position: toast.POSITION.BOTTOM_RIGHT,
                      })
                    : setShowVisible(!showVisible)
                  : newlySelectedVisibilityRows.length === 0 &&
                    newlyDeselectedVisibilityRows.length === 0
                  ? setShowlatest(!showlatest)
                  : setShowUpdateAll(!showUpdateAll);
              }}
            >
              Update
            </button>
          </Col>
        </Row>
        <Row className="mt-5">
          <Modal
            show={show1}
            backdrop="static"
            size="sm"
            centered
            className="p-2"
          >
            <Modal.Body className="m-1">
              <h5
                style={{
                  textAlign: "center",
                  color: "#a3238e",
                  fontWeight: "bold",
                }}
              >
                Are you sure you want to delete?
              </h5>
              <Row>
                <Col
                  style={{
                    textAlign: "center",
                  }}
                >
                  <h6
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Chemical Name:
                  </h6>
                  {selectedProductDelete?.chemicalName
                    ? selectedProductDelete?.chemicalName
                    : "--"}
                  <h6
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    CAT Number:
                  </h6>
                  {selectedProductDelete?.catalogId
                    ? selectedProductDelete?.catalogId
                    : "--"}

                  <h6
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    CAS Number:
                  </h6>
                  {selectedProductDelete?.casNumber
                    ? selectedProductDelete?.casNumber
                    : "--"}

                  <h6
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Inventory Status:
                  </h6>
                  {selectedProductDelete?.catalogId
                    ? selectedProductDelete?.catalogId
                    : "--"}
                </Col>
              </Row>

              <div className="d-flex justify-content-between align-items-center mx-5">
                <button
                  style={{
                    top: "8rem",
                    left: "2rem",
                    borderRadius: "18px",
                    height: "2rem",
                    width: "4rem",
                    fontSize: "11px",
                    border: "1.5px solid black",
                    background: "white",
                    fontWeight: "bold",
                  }}
                  onClick={() => {
                    deleteProduct(selectedProductDelete?.id);
                    setShow1(false);
                  }}
                >
                  YES
                </button>
                <button
                  style={{
                    top: "8rem",
                    left: "11rem",
                    borderRadius: "18px",
                    height: "2rem",
                    width: "4rem",
                    fontSize: "11px",
                    border: "1.5px solid black",
                    background: "white",
                    fontWeight: "bold",
                  }}
                  onClick={() => setShow1(false)}
                >
                  NO
                </button>
              </div>
            </Modal.Body>
          </Modal>
          <Modal
            show={showlatest}
            backdrop="static"
            size="sm"
            centered
            className="p-4"
          >
            <Modal.Body className="m-3">
              <h3
                style={{
                  textAlign: "center",
                  color: "#a3238e",
                  fontWeight: "bold",
                }}
              >
                Are you sure?
              </h3>
              <p
                style={{
                  textAlign: "center",

                  top: "4rem",
                  left: "2rem",
                  fontWeight: "bold",
                }}
              >
                Update the selected to latest products
              </p>
              <div className="d-flex justify-content-between align-items-center mx-5">
                <button
                  style={{
                    top: "8rem",
                    left: "2rem",
                    borderRadius: "18px",
                    height: "2rem",
                    width: "4rem",
                    fontSize: "11px",
                    border: "1.5px solid black",
                    background: "white",
                    fontWeight: "bold",
                  }}
                  onClick={() => {
                    addToLatestApi();
                    setshowUpdateConfirm(!showUpdateConfirm)
                      ? setShowlatest(true)
                      : setShowlatest(false);
                  }}
                >
                  YES
                </button>
                <button
                  style={{
                    top: "8rem",
                    left: "11rem",
                    borderRadius: "18px",
                    height: "2rem",
                    width: "4rem",
                    fontSize: "11px",
                    border: "1.5px solid black",
                    background: "white",
                    fontWeight: "bold",
                  }}
                  onClick={() => setShowlatest(false)}
                >
                  NO
                </button>
              </div>
            </Modal.Body>
          </Modal>
          <Modal
            show={showUpdateAll}
            backdrop="static"
            size="sm"
            centered
            className="p-4"
          >
            <Modal.Body className="m-3">
              <h3
                style={{
                  textAlign: "center",
                  color: "#a3238e",
                  fontWeight: "bold",
                }}
              >
                Are you sure?
              </h3>
              <p
                style={{
                  textAlign: "center",

                  top: "4rem",
                  left: "2rem",
                  fontWeight: "bold",
                }}
              >
                Update the selected products?
              </p>
              <div className="d-flex justify-content-between align-items-center mx-5">
                <button
                  style={{
                    top: "8rem",
                    left: "2rem",
                    borderRadius: "18px",
                    height: "2rem",
                    width: "4rem",
                    fontSize: "11px",
                    border: "1.5px solid black",
                    background: "white",
                    fontWeight: "bold",
                  }}
                  onClick={() => {
                    addToLatestApi();
                    visibilityApi();
                    setshowUpdateConfirm(!showUpdateConfirm)
                      ? setShowUpdateAll(true)
                      : setShowUpdateAll(false);
                  }}
                >
                  YES
                </button>
                <button
                  style={{
                    top: "8rem",
                    left: "11rem",
                    borderRadius: "18px",
                    height: "2rem",
                    width: "4rem",
                    fontSize: "11px",
                    border: "1.5px solid black",
                    background: "white",
                    fontWeight: "bold",
                  }}
                  onClick={() => setShowUpdateAll(false)}
                >
                  NO
                </button>
              </div>
            </Modal.Body>
          </Modal>
          <Modal
            show={showVisible}
            backdrop="static"
            size="sm"
            centered
            className="p-4"
          >
            <Modal.Body className="m-3">
              <h3
                style={{
                  textAlign: "center",
                  color: "#a3238e",
                  fontWeight: "bold",
                }}
              >
                Are you sure?
              </h3>
              <p
                style={{
                  textAlign: "center",

                  top: "4rem",
                  left: "2rem",
                  fontWeight: "bold",
                }}
              >
                The selected products will not be visible?
              </p>
              <div className="d-flex justify-content-between align-items-center mx-5">
                <button
                  style={{
                    top: "8rem",
                    left: "2rem",
                    borderRadius: "18px",
                    height: "2rem",
                    width: "4rem",
                    fontSize: "11px",
                    border: "1.5px solid black",
                    background: "white",
                    fontWeight: "bold",
                  }}
                  onClick={() => {
                    visibilityApi();
                    setshowUpdateConfirm(!showUpdateConfirm)
                      ? setShowVisible(true)
                      : setShowVisible(false);
                  }}
                >
                  YES
                </button>
                <button
                  style={{
                    top: "8rem",
                    left: "11rem",
                    borderRadius: "18px",
                    height: "2rem",
                    width: "4rem",
                    fontSize: "11px",
                    border: "1.5px solid black",
                    background: "white",
                    fontWeight: "bold",
                  }}
                  onClick={() => setShowVisible(false)}
                >
                  NO
                </button>
              </div>
            </Modal.Body>
          </Modal>
          <Modal
            show={showUpdateConfirm}
            backdrop="static"
            size="sm"
            centered
            className="p-4"
          >
            <Modal.Body className="m-3">
              <h3
                style={{
                  textAlign: "center",
                  color: "green",
                  fontWeight: "bold",
                }}
              >
                Successfull!
              </h3>
              <p
                style={{
                  textAlign: "center",

                  top: "4rem",
                  left: "2rem",
                  fontWeight: "bold",
                }}
              >
                Updated Successfully
              </p>
              <div className="d-flex justify-content-between align-items-center mx-5">
                <button
                  style={{
                    marginLeft: "2rem",
                    alignItems: "center",
                    borderRadius: "18px",
                    height: "2rem",
                    width: "4rem",
                    fontSize: "11px",
                    border: "1.5px solid black",
                    background: "white",
                    fontWeight: "bold",
                  }}
                  onClick={() =>
                    setshowUpdateConfirm(false)
                      ? setshowUpdateConfirm(false)
                      : setShowlatest(false)
                  }
                >
                  Close
                </button>
              </div>
            </Modal.Body>
          </Modal>

          <Table
            table={table}
            className="custom-table"
            columns={columns}
            data={allProductList}
            rowKey="id"
            rowKeyField="id"
            rowPropsGetter={rowPropsGetter}
            noData={{
              text: "No Data Found",
            }}
            onRowSelect={handleRowSelect && handleVisibilityRowSelect}
            paging={{
              enabled: true,
              pageSize: 10,
              pageIndex: pageIndex,
            }}
            loading={{
              enabled: status,
              text: "Fetching Data",
            }}
            childComponents={{
              rootDiv: {
                elementAttributes: () => ({
                  style: { backgroundColor: "#f7f7f7", borderRadius: "15px" },
                }),
              },
              dataRow: {
                elementAttributes: (rowData, rowIndex) => ({
                  style: {
                    borderWidth: 1,
                  },
                  onMouseEnter: (event, extendedEvent) => {
                    const rows = event.currentTarget.querySelectorAll("td");
                    rows.forEach((row) => {
                      row.style.color = "#a3238e";
                      row.style.borderColor = "1px solid #a3238e";
                    });
                  },
                  onMouseLeave: (event, extendedEvent) => {
                    event.currentTarget.style.borderColor = "white";
                    const rows = event.currentTarget.querySelectorAll("td");
                    rows.forEach((cell) => {
                      cell.style.color = "";
                      cell.style.border = "";
                    });
                  },
                }),
              },

              cell: {
                content: ({ column, rowData }) => {
                  const isCheckedLatest = selectedAddToLatestRows.some(
                    (row) => row.id === rowData.id
                  );
                  const isCheckedVisibility = selectedVisibilityRows.some(
                    (row) => row.id === rowData.id
                  );
                  const updateBtnColor = () => {
                    const button = document.getElementById("updatebtn");
                    if (selectedAddToLatestRows.length > 0) {
                      button.style.backgroundColor = "transparent";
                      button.style.color = "black";
                      button.style.border = "2px solid black";
                    }
                  };
                  const AddtoLatestHandleCheckboxChange = () => {
                    if (isCheckedLatest) {
                      if (
                        !newlyDeselectedRows.some(
                          (row) => row.id === rowData.id
                        )
                      ) {
                        setNewlyDeselectedRows((prevDeselectedRows) => [
                          rowData,
                          ...prevDeselectedRows,
                        ]);
                      }

                      setNewlySelectedRows((prevSelectedRows) =>
                        prevSelectedRows.filter((row) => row.id !== rowData.id)
                      );
                      setSelectedAddToLatestRows(
                        (prevSelectedAddToLatestRows) =>
                          prevSelectedAddToLatestRows.filter(
                            (row) => row.id !== rowData.id
                          )
                      );
                      updateBtnColor();
                    } else {
                      if (
                        !newlySelectedRows.some((row) => row.id === rowData.id)
                      ) {
                        setNewlySelectedRows((prevSelectedRows) => [
                          rowData,
                          ...prevSelectedRows,
                        ]);
                      }

                      setNewlyDeselectedRows((prevDeselectedRows) =>
                        prevDeselectedRows.filter(
                          (row) => row.id !== rowData.id
                        )
                      );
                      handleRowSelect(rowData);
                      updateBtnColor();
                    }
                  };

                  const VisibilityHandleCheckboxChange = () => {
                    if (isCheckedVisibility) {
                      if (
                        !newlyDeselectedVisibilityRows.some(
                          (row) => row.id === rowData.id
                        )
                      ) {
                        setNewlyDeselectedVisibilityRows(
                          (prevDeselectedRows) => [
                            rowData,
                            ...prevDeselectedRows,
                          ]
                        );
                      }

                      setNewlySelectedVisibilityRows((prevSelectedRows) =>
                        prevSelectedRows.filter((row) => row.id !== rowData.id)
                      );
                      setSelectedVisibilityRows((prevSelectedVisibilityRows) =>
                        prevSelectedVisibilityRows.filter(
                          (row) => row.id !== rowData.id
                        )
                      );
                      updateBtnColor();
                    } else {
                      if (
                        !newlySelectedVisibilityRows.some(
                          (row) => row.id === rowData.id
                        )
                      ) {
                        setNewlySelectedVisibilityRows((prevSelectedRows) => [
                          rowData,
                          ...prevSelectedRows,
                        ]);
                      }

                      setNewlyDeselectedVisibilityRows((prevDeselectedRows) =>
                        prevDeselectedRows.filter(
                          (row) => row.id !== rowData.id
                        )
                      );
                      handleVisibilityRowSelect(rowData);
                      updateBtnColor();
                    }
                  };

                  switch (column?.key) {
                    case "ADD_TO_LATEST":
                      return (
                        <input
                          type="checkbox"
                          name={column.key}
                          id={column.title}
                          onChange={AddtoLatestHandleCheckboxChange}
                          checked={isCheckedLatest}
                        />
                      );
                    case "DISAPPEAR":
                      return (
                        <input
                          type="checkbox"
                          name={column.key}
                          id={column.title}
                          onChange={VisibilityHandleCheckboxChange}
                          checked={isCheckedVisibility}
                        />
                      );
                    case "OPTIONS":
                      const [showToolTip, setShowToolTip] = useState(false);
                      const [target, setTarget] = useState(null);

                      const handleButtonClick = (event) => {
                        setShowToolTip(!showToolTip);
                        setTarget(event.target);
                      };

                      const handleCloseOverlay = () => {
                        setShowToolTip(false);
                      };

                      return (
                        <div>
                          <button
                            className="options-button"
                            onClick={handleButtonClick}
                          >
                            <GiSettingsKnobs
                              size="15px"
                              style={{ transform: "rotate(90deg)" }}
                            />
                          </button>

                          <Overlay
                            show={showToolTip}
                            target={target}
                            placement="bottom"
                            rootClose
                            onHide={handleCloseOverlay}
                          >
                            <Tooltip
                              id="tooltip-custom"
                              className="tooltip-custom"
                            >
                              <Row
                                className="options-button"
                                onClick={() => {
                                  fetchProductById(rowData.id);
                                  setShowToolTip(false);
                                }}
                              >
                                <Col>Edit</Col>
                                <Col>
                                  <MdEdit size={25} />
                                </Col>
                              </Row>
                              <Row
                                className="options-button"
                                onClick={() => {
                                  setSelectedproductDelete(rowData);
                                  setShowToolTip(false);
                                  setShow1(!show1);
                                }}
                              >
                                <Col>Delete</Col>
                                <Col>
                                  <MdDeleteForever size={25} />
                                </Col>
                              </Row>
                            </Tooltip>
                          </Overlay>
                        </div>
                      );
                  }
                },
              },
            }}
          />
        </Row>
      </Row>
    </Container>
  );
}

const mapStateToProps = ({ authReducer: { getProductList } }) => ({
  getProductList,
});
const mapDispatchToProps = {
  getListOfProduct: (payloadData, accessToken) =>
    getListOfProduct(payloadData, accessToken),
  addToLatest: (payloadData) => addToLatest(payloadData),
  deleteListOfProductList: (payloadData, accessToken) =>
    deleteListOfProductList(payloadData, accessToken),
  searchApi: (payloadData) => searchProduct(payloadData),
  getProductBy: (payloadData) => getProductById(payloadData),
  visibilityApi: (payloadData, accessToken) =>
    isVisibleProduct(payloadData, accessToken),
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminDashboardComponent);
