import { Button, Paper } from "@mui/material";
import React from "react";
import { toast } from "react-toastify";
import { apiAuth } from "src/utils/http";

const ImplementationClosure = ({
  currentActivityForm,
  CheckLists,
  setCheckLists,
  contentDetails,
  closeActions,
  setIsLoading,
  contentDetailsIni,
  setOpen,
  evaluationId,
  closeActivity,
  getRecords,
}) => {
  const handleCheckboxChange = (id) => {

    setCheckLists((prevCheckLists) =>
      prevCheckLists.map((item) =>
        item.item === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  const saveChanges = () => {
    apiAuth
      .post(`/DocMoc/UpdateImplementationChecklist/${evaluationId}`, CheckLists)
      .then((response) => {
        toast?.success("Checklist successfully updated");
        setOpen(false);

      });
  };

  const handelCloseMoc = (uid) => {
    const allItemsChecked = CheckLists.every((item) => item.isChecked);

    if (!allItemsChecked) {
      toast?.error(
        "Please complete all checklist items before closing the MOC."
      );
      return;
    }
    setIsLoading(true);
    apiAuth
      .post(`/DocMoc/ImplementationSubmit/${evaluationId}/22`, {
        actionUID: uid,
        activityUID: closeActivity.uid,

        formUID: closeActivity.formUID,
      })
      .then((resp) => {
        if (resp.data.statusCode == 400) {
          setIsLoading(false);

          toast?.error(resp.data.message);
        } else {
          toast?.success("MOC Successfully Closed");
          setTimeout(() => {
            getRecords();
            setIsLoading(false);
          }, 2000);
        }
      });
  };
  return (
    <Paper className="w-full  mx-auto sm:my-8 lg:mt-16  rounded-16 shadow overflow-hidden">
      <div
        _ngcontent-fyk-c288=""
        class="flex items-center w-full p-30 pt-24 pb-24 border-b justify-between"
      >
        <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
          Closure by Doc Controller
        </h2>
      </div>
      <Paper className="w-full box_reset">
        <div
          _ngcontent-fyk-c288=""
          class="p-30 pt-24 pb-24  mb-0 ng-star-inserted"
        >
          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full mb-10 justify-between"
          >
            <h2 _ngcontent-fyk-c288="" class="text-xl font-semibold">
              Summary Details
            </h2>
          </div>
          <div
            _ngcontent-fyk-c288=""
            class="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
          >
            <div _ngcontent-fyk-c288="" className="my-6">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Request No{" "}
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                {contentDetails?.requestNo}
              </div>
            </div>
            <div _ngcontent-fyk-c288="" className="my-6">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Initiator
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                {contentDetails?.initiatorName}
              </div>
            </div>
            <div _ngcontent-fyk-c288="" className="my-6">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Initiated On
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                {new Date(contentDetails?.requestDate).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </div>
            </div>
          </div>

          <div
            _ngcontent-fyk-c288=""
            class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
          >
            <div _ngcontent-fyk-c288="" className="my-6">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Type{" "}
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                {contentDetails?.requestTypeName}
              </div>
            </div>
            <div _ngcontent-fyk-c288="" className="my-6">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Document Name
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                {contentDetails?.projectName}
              </div>
            </div>
            <div _ngcontent-fyk-c288="" className="my-6">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Document Type
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                {contentDetails?.documentType}New
              </div>
            </div>
          </div>

          <div
            _ngcontent-fyk-c288=""
            class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 lg:grid-cols-1 lg:gap-16 w-full"
          >
            <div _ngcontent-fyk-c288="" className="my-6">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Document Description
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                {contentDetailsIni?.projectDescription}
              </div>
            </div>
          </div>
          <div
            _ngcontent-fyk-c288=""
            class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 lg:grid-cols-1 lg:gap-16 w-full"
          >
            <div _ngcontent-fyk-c288="" className="my-6">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Reason for New Document
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                {contentDetailsIni?.reasonForNewDocument}
              </div>
            </div>
          </div>

          <div
            _ngcontent-fyk-c288=""
            class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 lg:grid-cols-1 lg:gap-16 w-full"
          >
            <div _ngcontent-fyk-c288="" className="my-6">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Document Url
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                <a
                  _ngcontent-fyk-c288=""
                  target="_blank"
                  class="text-blue-500 hover:text-blue-800"
                  style={{ background: "none", color: "blue" }}
                  href={contentDetails?.documentUrl}
                >
                  {contentDetails?.documentUrl}
                </a>
              </div>
            </div>
          </div>
          <div
            _ngcontent-fyk-c288=""
            class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 lg:grid-cols-1 lg:gap-16 w-full"
          >
            <div _ngcontent-fyk-c288="" className="my-6">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Consolidated Document Url
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                <a
                  _ngcontent-fyk-c288=""
                  target="_blank"
                  class="text-blue-500 hover:text-blue-800"
                  style={{ background: "none", color: "blue" }}
                  href={contentDetails?.documentUrl}
                >
                  {contentDetails?.consolidatedDocumentUrl}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Paper>

      <div className="flex flex-col px-4 py-3  border rounded m-24">
        <ul>
          {CheckLists.map((item) => (
            <li key={item.id} className="pb-5">
              <label>
                <input
                  type="checkbox"
                  checked={item.isChecked}
                  style={{
                    margin: "5px",
                    color:
                      currentActivityForm.canEdit == false ? "grey" : "black",
                  }}
                  disabled={!currentActivityForm.canEdit}
                  onChange={() => {
                    handleCheckboxChange(item.item);
                  }}
                />
                <span
                  style={{
                    margin: "5px",
                    color:
                      currentActivityForm.canEdit == false ? "grey" : "black",
                  }}
                >
                  {item.item}
                </span>{" "}
              </label>
            </li>
          ))}
          {!currentActivityForm.isComplete &&
            currentActivityForm.status === "Pending" && (
              <Button
                className="whitespace-nowrap ms-5 "
                variant="contained"
                color="secondary"
                style={{
                  marginTop: "10px",
                  width: "150px",
                  marginBottom: "5px",
                }}
                onClick={saveChanges}
              >
                Save
              </Button>
            )}
        </ul>
      </div>

      {currentActivityForm.canEdit && (
        <>
          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full  border-b justify-between"
          ></div>
          <div className="flex justify-end p-30 pt-24 pb-24">
            {closeActions.map((btn) => (
              <Button
                className="whitespace-nowrap"
                variant="contained"
                color="secondary"
                onClick={(e) => handelCloseMoc(btn.uid)}
              >
                {btn.name}
              </Button>
            ))}
          </div>
        </>
      )}
    </Paper>
  );
};

export default ImplementationClosure;
