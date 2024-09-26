import Request from "../utils/request";

export const GetQuestionByTopicId = async (topicId) => {
  try {
    const respone = await Request({
      method: "get",
      url: `Question/getQuestionByTopicId?topicId=${topicId}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(respone);
    return respone;
  } catch (e) {
    return e;
  }
};
export const GetQuestionByTopicIdInUser = async (topicId) => {
  try {
    const respone = await Request({
      method: "get",
      url: `Question/GetQuestionByTopicIdInUser?topicId=${topicId}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(respone);
    return respone;
  } catch (e) {
    return e;
  }
};
export const GetAllQuestionByTopicIdService = async (topicId) => {
  try {
    const respone = await Request({
      method: "get",
      url: `Question/getAllQuestionByTopicId?topicId=${topicId}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return respone;
  } catch (e) {
    return e;
  }
};

export const AddQuestionService = async (data) => {
  try {
    const respone = await Request({
      method: "post",
      url: `Question/addQuestion`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    return respone;
  } catch (e) {
    return e;
  }
};

export const EditQuestionService = async (data) => {
  try {
    const respone = await Request({
      method: "post",
      url: `Question/editQuestion`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    return respone;
  } catch (e) {
    return e;
  }
};

export const ChangeStatusQuestionService = async (questionId, status) => {
  try {
    const respone = await Request({
      method: "post",
      url: `Question/changeStatusQuestion?questionId=${questionId}&status=${status}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return respone;
  } catch (e) {
    return e;
  }
};

export const ApproveAllQuestionService = async (topicId) => {
  try {
    const response = await Request({
      method: "post",
      url: `Question/approveAllQuestion?topicId=${topicId}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const AddQuestionByExcelService = async (data) => {
  try {
    const response = await Request({
      method: "post",
      url: `Question/addQuestionByExcel`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_AUTH_TOKEN",
      },
      data: data,
    });
    return response;
  } catch (error) {
    return error;
  }
};
