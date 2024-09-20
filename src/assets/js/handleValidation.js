
export default function hanldeValidationEditUser(editData, errors, phoneList) {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const current = `${year}-${month}-${day}`;
    if (!/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(editData.editPhoneNumber)) {
        errors.editPhoneNumber = 'Số điện thoại phải 10 chữ số';
    }
    if (editData.editPhoneNumber == '' || editData.editPhoneNumber == null || editData.editPhoneNumber == " ") {
        errors.editPhoneNumber = "Số điện thoại không được để trống";
    }
    if (phoneList.includes(editData.editPhoneNumber)) {
        errors.editPhoneNumber = "Số điện thoại đã được đăng ký";
    }

    if (editData.editFullName == '' || editData.editFullName == null || editData.editFullName == " ") {
        errors.editFullName = "Tên không được để trống";
    }
    if (!/^[\p{L}\s]+$/u.test(editData.editFullName)) {
        errors.editFullName = "Tên không chứa kí tự đặc biệt";
    }
    // if (editData.editBirthDay == '' || editData.editBirthDay == null || editData.editBirthDay == " ") {
    //     errors.editBirthDay = "Ngày sinh không được để trống";
    // }
    if (editData.editBirthDay > current == true) {
        errors.editBirthDay = "Ngày sinh phải nhỏ hơn ngày hiện tại";
    }

}

export function hanldeValidationEditMod(editData, errors, phoneList) {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const current = `${year}-${month}-${day}`;
    if (!/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(editData.editPhoneNumber)) {
        errors.editPhoneNumber = 'Số điện thoại phải 10 chữ số';
    }
    if (editData.editPhoneNumber == '' || editData.editPhoneNumber == null || editData.editPhoneNumber == " ") {
        errors.editPhoneNumber = "Số điện thoại không được để trống";
    }
    if (phoneList.includes(editData.editPhoneNumber)) {
        errors.editPhoneNumber = "Số điện thoại đã được đăng ký";
    }

    if (editData.editFullName == '' || editData.editFullName == null || editData.editFullName == " ") {
        errors.editFullName = "Tên không được để trống";
    }
    if (!/^[\p{L}\s]+$/u.test(editData.editFullName)) {
        errors.editFullName = "Tên không chứa kí tự đặc biệt";
    }
    // if (editData.editBirthDay == '' || editData.editBirthDay == null || editData.editBirthDay == " ") {
    //     errors.editBirthDay = "Ngày sinh không được để trống";
    // }
    if (editData.editBirthDay > current == true) {
        errors.editBirthDay = "Ngày sinh phải nhỏ hơn ngày hiện tại";
    }

}


export function hanldeValidationCreateMod(creataData, errors, emailList, phoneList) {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const current = `${year}-${month}-${day}`;
    if (!/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(creataData.createPhoneNumber)) {
        errors.createPhoneNumber = 'Số điện thoại phải 10 chữ số';
    }
    if (creataData.createPhoneNumber == '' || creataData.createPhoneNumber == null || creataData.createPhoneNumber == " ") {
        errors.createPhoneNumber = "Số điện thoại không được để trống";
    }
    if (phoneList.includes(creataData.createPhoneNumber)) {
        errors.createPhoneNumber = "Số điện thoại đã được đăng ký";
    }
    if (creataData.createFullName == '' || creataData.createFullName == null || creataData.createFullName == " ") {
        errors.createFullName = "Tên không được để trống";
    }
    if (!/^[\p{L}\s]+$/u.test(creataData.createFullName)) {
        errors.createFullName = "Tên không chứa kí tự đặc biệt";
    }
    if (creataData.createEmail == '' || creataData.createEmail == null || creataData.createEmail == " ") {
        errors.createEmail = "Email không được để trống"
    } else {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(creataData.createEmail)) {
            errors.createEmail = "Email sai định dạng";
        }
    }
    if (emailList.includes(creataData.createEmail)) {
        errors.createEmail = "Email đã được đăng ký";
    }
    if (creataData.createBirthDay == '' || creataData.createBirthDay == null || creataData.createBirthDay == " ") {
        errors.createBirthDay = "Ngày sinh không được để trống";
    }
    if (creataData.createBirthDay > current == true) {
        errors.createBirthDay = "Ngày sinh phải nhỏ hơn ngày hiện tại";
    }

    if (creataData.createGender == undefined || creataData.createGender == null || creataData.createGender == "") {
        errors.createGender = "Giới tính không được để trống"
    }
}

export function handleValidationRegister(registerInput, errors, emailList, phoneList) {
    if (registerInput.inputHo == '' || registerInput.inputHo == null || registerInput.inputHo == " ") {
        errors.inputHo = "Họ không được để trống";
    }
    if (!/^[\p{L}\s]+$/u.test(registerInput.inputHo)) {
        errors.inputHo = "Họ không chứa kí tự đặc biệt";
    }

    if (registerInput.inputTen == "" || registerInput.inputTen == null || registerInput.inputTen == " ") {
        errors.inputTen = "Tên không được để trống";
    }
    if (!/^[\p{L}\s]+$/u.test(registerInput.inputTen)) {
        errors.inputTen = "Tên không chứa kí tự đặc biệt";
    }

    if (registerInput.inputEmail == '' || registerInput.inputEmail == null || registerInput.inputEmail == " ") {
        errors.inputEmail = "Email không được để trống"
    } else {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerInput.inputEmail)) {
            errors.inputEmail = "Email sai định dạng";
        }
    }
    if (emailList.includes(registerInput.inputEmail)) {
        errors.inputEmail = "Email đã được đăng ký";
    }
    // if (!/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(registerInput.inputPhone)) {
    //     errors.inputPhone = 'Số điện thoại phải 10 chữ số';
    // }
    if (registerInput.inputPhone == '' || registerInput.inputPhone == null || registerInput.inputPhone == " ") {
        errors.inputPhone = "Số điện thoại không được để trống";
    }
    if (phoneList.includes(registerInput.inputPhone)) {
        errors.inputPhone = "Số điện thoại đã được đăng ký";
    }
}

export function handleValidationForgotPassword(emailforgot, errors, emailList) {
    if (!emailList.includes(emailforgot)) {
        errors.emailforgot = "Email này chưa được đăng ký trong hệ thống";
    }

}


export function handleValidationUpdateUser(editData, errors, phoneList) {
    if (editData.editFullName == "" || editData.editFullName == null || editData.editFullName == " ") {
        errors.editFullName = "Tên không được để trống";
    }
    if (!/^[\p{L}\s]+$/u.test(editData.editFullName)) {
        errors.editFullName = "Tên không chứa kí tự đặc biệt";
    }

    if (!/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(editData.editPhone)) {
        errors.editPhone = 'Số điện thoại phải 10 chữ số';
    }
    if (editData.editPhone == '' || editData.editPhone == null || editData.editPhone == " ") {
        errors.editPhone = "Số điện thoại không được để trống";
    }
    if (phoneList.includes(editData.editPhone)) {
        errors.editPhone = "Số điện thoại đã được đăng ký";
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const current = `${year}-${month}-${day}`;

    if (editData.editBirthDay > current == true) {
        errors.editBirthDay = "Ngày sinh phải nhỏ hơn ngày hiện tại";
    }
}

export function handleValidationChangePassword(newPassword, errors) {
    if (newPassword.inputNewPassword == "" || newPassword.inputNewPassword == null || newPassword.inputNewPassword == " ") {
        errors.inputNewPassword = "Không được để trống"
    } else {
        if (newPassword.inputNewPassword.length >= 6) {
            if (!/[A-Z]/.test(newPassword.inputNewPassword.charAt(0))) {
                errors.inputNewPassword = 'Mật khẩu phải bắt đầu bằng chữ hoa';
            } else if (!/[a-zA-Z]/.test(newPassword.inputNewPassword) || !/[0-9]/.test(newPassword.inputNewPassword)) {
                errors.inputNewPassword = 'Mật khẩu phải chứa chữ và số';
            } else if (newPassword.inputComfirmPassword == "" || newPassword.inputComfirmPassword == null || newPassword.inputComfirmPassword == " ") {
                errors.inputComfirmPassword = 'Không được để trống';
            } else if (newPassword.inputNewPassword != newPassword.inputComfirmPassword) {
                errors.inputComfirmPassword = 'Mật khẩu và xác thực mật khẩu không khớp';
            }
        } else {
            errors.inputNewPassword = "Độ dài mật khải phải trên 6"
        }
    }

}


export function handleValidationCreateTopic(createData, errors) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const current = `${year}-${month}-${day}`;
    if (createData.createSubjectId == "Chọn môn học") {
        errors.createSubjectId = "Môn học không được để trống";
    }
    if (createData.createTopicType == "Chọn loại topic") {
        errors.createTopicType = "Loại topic không được để trống";
    } else if (createData.createTopicType != "1") {
        if (createData.createDuration == "Chọn thời gian") {
            errors.createDuration = "Thời gian không được để trống";
        }
    }
    if (createData.createTopicType == 6) {
        if (createData.createEndDate == "" || createData.createEndDate == null || createData.createStartDate == "" || createData.createStartDate == null) {
            errors.createStartDate = "Ngày bắt đầu hoặc ngày kết thúc không được để trống";
        }
    }
    if (createData.createTopicType != 5 && createData.createTopicType != 6) {
        if (createData.createGrade == "Chọn lớp") {
            errors.createGrade = "Lớp học không được để trống";
        }
    }
    if (createData.createTopicName == "" || createData.createTopicName == " " || createData.createTopicName == null) {
        errors.createTopicName = "Tên topic không được để trống";
    }
    if (createData.createEndDate && createData.createEndDate < current) {
        errors.createStartDate = "Thời gian bắt đầu không thể ở quá khứ.";
    }
        // Validate that the duration is at least 2 days
        const startDate = new Date(createData.editStartDate);
        const endDate = new Date(createData.editEndDate);
        const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
        const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    
        if (createData.editStartDate && createData.editStartDate < current) {
            errors.createStartDate = "Thời gian bắt đầu không thể ở quá khứ.";
        }
        if (differenceInDays < 2) {
            errors.createStartDate = "Cuộc thi cần kéo dài ít nhất 2 ngày.";
        }
}

export function handleValidationUpdateTopic(editData, errors) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const current = `${year}-${month}-${day}`;

    if (editData.editSubjectId == "Chọn môn học") {
        errors.editSubjectId = "Môn học không được để trống";
    }
    if (editData.editTopicType == "Chọn loại topic") {
        errors.editTopicType = "Loại topic không được để trống";
    } else if (editData.editGrade != "1") {
        if (editData.editDuration == "Chọn thời gian") {
            errors.editDuration = "Thời gian không được để trống";
        }
    }

    if (editData.editGrade == "Chọn lớp") {
        errors.editGrade = "Lớp học không được để trống";
    }
    if (editData.editTopicName == "" || editData.editTopicName == " " || editData.editTopicName == null) {
        errors.editTopicName = "Tên topic không được để trống";
    }

    if (editData.editTopicType == 6) {
        if (editData.editStartDate == "" || editData.editStartDate == null || editData.editStartDate == "" || editData.editStartDate == null) {
            errors.editStartDate = "Ngày bắt đầu hoặc ngày kết thúc không được để trống";
        }
    }

    // Validate that the duration is at least 2 days
    const startDate = new Date(editData.editStartDate);
    const endDate = new Date(editData.editEndDate);
    const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    if (editData.editStartDate && editData.editStartDate < current) {
        errors.editStartDate = "Thời gian bắt đầu không thể ở quá khứ.";
    }

    if (differenceInDays < 2) {
        errors.editStartDate = "Cuộc thi cần kéo dài ít nhất 2 ngày.";
    }
}

export function handleValidationCreateQuestion(createData, errors) {
    if (createData.createLevelId == "Chọn cấp độ" || createData.createLevelId == "") {
        errors.createLevelId = "Cấp độ câu hỏi không được để trống";
    }
    if (createData.createQuestionContent == null || createData.createQuestionContent == " " || createData.createQuestionContent == "") {
        errors.createQuestionContent = "Nội dung câu hỏi không được để trống";
    }
    if (createData.createOptionA == null || createData.createOptionA == " " || createData.createOptionA == "") {
        errors.createOptionA = "Lựa chọn A không được để trống";
    }
    if (createData.createOptionB == null || createData.createOptionB == " " || createData.createOptionB == "") {
        errors.createOptionB = "Lựa chọn B không được để trống";
    }
    if (createData.createOptionC == null || createData.createOptionC == " " || createData.createOptionC == "") {
        errors.createOptionC = "Lựa chọn C không được để trống";
    }
    if (createData.createOptionD == null || createData.createOptionD == " " || createData.createOptionD == "") {
        errors.createOptionD = "Lựa chọn D không được để trống";
    }
    if (createData.editStartDate && createData.editEndDate && (createData.editEndDate - createData.editStartDate) < 2 * 24 * 60 * 60 * 1000) {
        createData.editStartDate = "Cuộc thi cần kéo dài ít nhất 2 ngày.";
    }
}

export function handleValidationEditQuestion(editData, errors) {
    if (editData.editLevelId == "Chọn cấp độ" || editData.editLevelId == "") {
        errors.editLevelId = "Cấp độ câu hỏi không được để trống";
    }
    if (editData.editQuestionContent == "<p><br></p>" || editData.editQuestionContent == "<p> </p>") {
        errors.editQuestionContent = "Nội dung câu hỏi không được để trống";
    }
    if (editData.editOptionA == "<p><br></p>" || editData.editOptionA == "<p> </p>") {
        errors.editOptionA = "Lựa chọn A không được để trống";
    }
    if (editData.editOptionB == "<p><br></p>" || editData.editOptionB == "<p> </p>") {
        errors.editOptionB = "Lựa chọn B không được để trống";
    }
    if (editData.editOptionC == "<p><br></p>" || editData.editOptionC == "<p> </p>") {
        errors.editOptionC = "Lựa chọn C không được để trống";
    }
    if (editData.editOptionD == "<p><br></p>" || editData.editOptionD == "<p> </p>") {
        errors.editOptionD = "Lựa chọn D không được để trống";
    }
    if (editData.editAnswerId == "Chọn đáp án" || editData.editAnswerId == "") {
        errors.editAnswerId = "Đáp án câu hỏi không được để trống";
    }
}

export function handleValidationCreateNew(createData, errors, imageUpload) {
    if (createData.createCategory == "Chọn loại") {
        errors.createCategory = "Loại tin tức không được để trống";
    }
    if (imageUpload == null) {
        errors.createImage = "Ảnh bìa không được để trống";
    }
    if (createData.createTitle == null || createData.createTitle == "" || createData.createTitle == " ") {
        errors.createTitle = "Tiêu đề không được để trống";
    }
    if (createData.createSubTitle == null || createData.createSubTitle == "" || createData.createSubTitle == " ") {
        errors.createSubTitle = "Tiêu đề phụ không được để trống";
    }
    if (createData.createContent == null || createData.createContent == "" || createData.createContent == " ") {
        errors.createContent = "Nội dung không được để trống";
    }
}

export function handleValidationEditNew(editData, errors, imageUpload) {
    if (editData.editCategory == "Chọn loại") {
        errors.editCategory = "Loại tin tức không được để trống";
    }
    if (imageUpload == null) {
        errors.editImage = "Ảnh bìa không được để trống";
    }
    if (editData.editTitle == null || editData.editTitle == "" || editData.editTitle == " ") {
        errors.editTitle = "Tiêu đề không được để trống";
    }
    if (editData.editSubTitle == null || editData.editSubTitle == "" || editData.editSubTitle == " ") {
        errors.createSubTitle = "Tiêu đề phụ không được để trống";
    }
    if (editData.editContent == null || editData.editContent == "" || editData.editContent == " ") {
        errors.editContent = "Nội dung không được để trống";
    }
}

export function hanldeValidationEditAdmin(editData, errors, phoneList) {
    if (!/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(editData.editPhoneNumber)) {
        errors.editPhoneNumber = 'Số điện thoại phải 10 chữ số';
    }
    if (editData.editPhoneNumber == '' || editData.editPhoneNumber == null || editData.editPhoneNumber == " ") {
        errors.editPhoneNumber = "Số điện thoại không được để trống";
    }
    if (phoneList.includes(editData.editPhoneNumber)) {
        errors.editPhoneNumber = "Số điện thoại đã được đăng ký";
    }
    if (editData.editFullName == '' || editData.editFullName == null || editData.editFullName == " ") {
        errors.editFullName = "Tên không được để trống";
    }
    if (!/^[\p{L}\s]+$/u.test(editData.editFullName )) {
        errors.editFullName = "Tên không chứa kí tự đặc biệt";
    }

    if (editData.editPassword == "" || editData.editPassword == null || editData.editPassword == " ") {
        errors.editPassword = "Không được để trống"
    }
}


export function hanldeValidationCreateAdmin(creataData, errors, emailList, phoneList) {
    if (!/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(creataData.createPhoneNumber)) {
        errors.createPhoneNumber = 'Số điện thoại phải 10 chữ số';
    }
    if (creataData.createPhoneNumber == '' || creataData.createPhoneNumber == null || creataData.createPhoneNumber == " ") {
        errors.createPhoneNumber = "Số điện thoại không được để trống";
    }
    if (phoneList.includes(creataData.createPhoneNumber)) {
        errors.createPhoneNumber = "Số điện thoại đã được đăng ký";
    }
    if (creataData.createFullName == '' || creataData.createFullName == null || creataData.createFullName == " ") {
        errors.createFullName = "Tên không được để trống";
    }
    if (!/^[\p{L}\s]+$/u.test(creataData.createFullName)) {
        errors.createFullName = "Tên không chứa kí tự đặc biệt";
    }

    if (creataData.createEmail == '' || creataData.createEmail == null || creataData.createEmail == " ") {
        errors.createEmail = "Email không được để trống"
    } else {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(creataData.createEmail)) {
            errors.createEmail = "Email sai định dạng";
        }
    }
    if (emailList.includes(creataData.createEmail)) {
        errors.createEmail = "Email đã được đăng ký";
    }
    if (creataData.createPassword == '' || creataData.createPassword == null || creataData.createPassword == " ") {
        errors.createPassword = "Mật khẩu không được để trống";
    }
}