import React, { useState, useEffect } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Table, useTable } from "ka-table";
import { DataType } from "ka-table/enums";
import { useNavigate } from "react-router-dom";
import {
  getCategoryList,
  addCategory,
  isVisibleCategory,
} from "../../application/services/actions/auth";
import { connect } from "react-redux";
import AdminHeaderComponent from "../AdminHeader/AdminHeaderComponent";
import { ActionType } from "ka-table/enums";
import * as yup from "yup";

const validationSchema = yup.object({
  CategoryName: yup.string().required("Category Name required"),
});

function CategoryAdminComponent(props) {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [status, setStatus] = useState(false);
  const [allProductList, setAllProductList] = useState([]);
  const [showlatest, setShowlatest] = useState(false);
  const [showUpdateConfirm, setshowUpdateConfirm] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedVisibilityRows, setSelectedVisibilityRows] = useState([]);
  const [newlySelectedVisibilityRows, setNewlySelectedVisibilityRows] =
    useState([]);
  const [newlyDeselectedVisibilityRows, setNewlyDeselectedVisibilityRows] =
    useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const accessToken = localStorage.getItem("accessToken");
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

  const { handleSubmit, handleChange, values, touched, errors } = useFormik({
    initialValues: {
      CategoryName: "",
    },
    enableReinitialize: true,
    validateOnChange: true,
    validateOnMount: true,
    validationSchema: validationSchema,
    onSubmit: () => formHandler(),
  });
  const columns = [
    { key: "id", title: "Sl No.", style: { textAlign: "center" } },
    {
      key: "categoryName",
      title: "CATEGORY NAME",
      style: { textAlign: "center" },
    },
    {
      key: "VISIBILITY",
      title: "VISIBILITY",
      style: { textAlign: "center" },
      dataType: DataType.Boolean,
      editor: false,
    },
  ];

  const catagoryListApi = () => {
    let payload = {
      typeRefId: null,
      pageNumber: 1,
      pageSize: 500,
      search: "",
      sortDirection: "",
      sortField: "",
      category: "",
    };

    setStatus(true);
    props
      .getCategoryList(payload,accessToken)
      .then((res) => {
        let selectedVisibility = res?.data.result.filter(
          (item) => item.isVisible === true
        );

        setStatus(false);
        setSelectedVisibilityRows(selectedVisibility);
        setCategoryList(res?.data?.result ? res?.data?.result : []);
      })
      .catch((error) => {
        setStatus(false);
      });
  };

  const formHandler = async () => {
    const payload = {
      id: "",
      categoryName: values.CategoryName ? values.CategoryName : "",
    };
    props
      .postCategory(payload,accessToken)
      .then((res) => {
        values.CategoryName = "";
        setShow(false);
        toast.success("New Category created Successfully!!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        catagoryListApi();
      })
      .catch((error) => {
        setShow(false);
        values.CategoryName = "";
        toast.error(
          error ? "Category already exists." : "New category not created.",
          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
      });
  };
  const handleVisibilityRowSelect = (rowData) => {
    if (!selectedVisibilityRows.some((row) => row.id === rowData.id)) {
      setSelectedVisibilityRows([...selectedVisibilityRows, rowData]);
    }
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
      .visibilityCategory(payload,accessToken)
      .then((res) => {
        catagoryListApi();
        setSelectedVisibilityRows([]);
        setAllProductList([]);
      })
      .catch((error) => {
        toast.error(error?.reason || "Category not updated for visibility!!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };

  useEffect(() => {
    catagoryListApi();
   
  }, []);

  return (
    <Container fluid className="main-div-cat" sm={6} lg={12}>
      <AdminHeaderComponent />
      <Row sm={12} md={12} lg={12} className="sec-cat align-items-center">
        <Modal show={show} backdrop="static" size="sm" centered className="p-2">
          <Modal.Body className="m-1">
            <h5
              style={{
                textAlign: "center",
                color: "black",
                fontWeight: "bold",
              }}
            >
              Enter the new category:
            </h5>

            <Row>
              <input
                id="CategoryName"
                name="CategoryName"
                type="text"
                onChange={handleChange("CategoryName")}
                value={values.CategoryName}
                placeholder="Enter the new Category"
                className="txt-box-cat mt-3"
              />
              {errors.CategoryName && touched.CategoryName ? (
                <div className="errorMessage-cat">{errors.CategoryName}</div>
              ) : null}
            </Row>

            <div className="d-flex justify-content-between align-items-center mx-5 mt-3">
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
                onClick={handleSubmit}
              >
                Submit
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
                onClick={() => setShow(false)}
              >
                Close
              </button>
            </div>
          </Modal.Body>
        </Modal>
        <Col sm={0} md={0} lg={2} style={{ backgroundColor: "#f7f7f7" }} />
        <Col sm={6} md={6} lg={4}>
          <button
            className="addcat-btn mx-1 text-center"
            onClick={() => setShow((p) => !p)}
          >
            Add New Category
          </button>
        </Col>
        <Col sm={6} md={6} lg={4}>
          <button
            id="updatebtn"
            className="update-btn mx-1 text-center"
            onClick={() => {
              selectedVisibilityRows && selectedVisibilityRows.length === 0
                ? toast.error("Please select category", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                  })
                : setShowlatest(!showlatest);
            }}
          >
            Update
          </button>
        </Col>
        <Col sm={0} md={0} lg={2} style={{ backgroundColor: "#f7f7f7" }} />
      </Row>
      <Row>
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
              You want to select the Category/s for visiblity?
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
          columns={columns}
          data={categoryList}
          rowKey="id"
          rowKeyField="id"
          rowPropsGetter={rowPropsGetter}
          noData={{
            text: "No Data Found",
          }}
          onRowSelect={handleVisibilityRowSelect}
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
                style: { backgroundColor: "#f7f7f7", borderRadius: "25px" },
              }),
            },
            dataRow: {
              elementAttributes: (rowData, rowIndex) => ({
                onMouseEnter: (event, extendedEvent) => {
                  const cells = event.currentTarget.querySelectorAll("td");
                  cells.forEach((cell) => {
                    cell.style.color = "#a3238e";
                  });
                },
                onMouseLeave: (event, extendedEvent) => {
                  event.currentTarget.style.borderColor = "white";
                  const cells = event.currentTarget.querySelectorAll("td");
                  cells.forEach((cell) => {
                    cell.style.color = "";
                  });
                },
              }),
            },
            cell: {
              content: ({ column, rowData }) => {
                const isCheckedVisibility = selectedVisibilityRows.some(
                  (row) => row.id === rowData.id
                );
                const updateBtnColor = () => {
                  const button = document.getElementById("updatebtn");
                  if (selectedVisibilityRows.length > 0) {
                    button.style.backgroundColor = "transparent";
                    button.style.color = "black";
                    button.style.border = "2px solid black";
                  }
                };
                const visibilityHandleCheckboxChange = () => {
                  if (isCheckedVisibility) {
                    if (
                      !newlyDeselectedVisibilityRows.some(
                        (row) => row.id === rowData.id
                      )
                    ) {
                      setNewlyDeselectedVisibilityRows((prevDeselectedRows) => [
                        rowData,
                        ...prevDeselectedRows,
                      ]);
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
                      prevDeselectedRows.filter((row) => row.id !== rowData.id)
                    );
                    handleVisibilityRowSelect(rowData);
                    updateBtnColor();
                  }
                };
                switch (column?.key) {
                  case "VISIBILITY":
                    return (
                      <input
                        type="checkbox"
                        name={column.key}
                        id={column.title}
                        onChange={visibilityHandleCheckboxChange}
                        checked={isCheckedVisibility}
                      />
                    );
                }
              },
            },
          }}
        />
      </Row>
    </Container>
  );
}

const mapStateToProps = ({ authReducer: { getCategoryList } }) => ({
  getCategoryList,
});
const mapDispatchToProps = {
  getCategoryList: (payloadData,accessToken) => getCategoryList(payloadData,accessToken),
  postCategory: (payloadData,accessToken) => addCategory(payloadData,accessToken),
  visibilityCategory: (payloadData,accessToken) => isVisibleCategory(payloadData,accessToken),
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryAdminComponent);
