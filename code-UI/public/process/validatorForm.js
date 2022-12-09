function Validator(option) {
  var selectorRules = {};

  function vadidate(inputElement, rule) {
    var errorMessage;
    var errorElement = inputElement.parentElement.querySelector(
      option.errorSelector
    );
    // Lấy ra các rules
    var rules = selectorRules[rule.selector];
    // console.log(rules)
    // Kiểm tra xem trong những thẻ input nhập vào có thảo mãn các rules đặt ra không
    for (var i = 0; i < rules.length; ++i) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) break;
    }
    // kiểm tra nếu có lỗi
    if (errorMessage) {
      errorElement.innerText = errorMessage;
      inputElement.parentElement.classList.add("invalid");
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    }
    return !errorMessage;
  }
  // Lấy element của form cần vadidate
  var formElement = document.querySelector(option.form);
  console.log(formElement);
  if (formElement) {
    formElement.onsubmit = function (e) {
      e.preventDefault();
      var isFormValid = true;
      option.rule.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = vadidate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });
      // submit dùng javascript
      if (isFormValid) {
        if (typeof option.onsubmit === "function") {
          var enableInputs = formElement.querySelectorAll("[name]");
          var formValues = Array.from(enableInputs);
          console.log("formValues:", formValues);
          var data = {};
          for (var i = 0; i < formValues.length; i++) {
            data[formValues[i].name] = formValues[i].value;
          }
          option.onsubmit(data);
        }
        // Submit hành vi mặc định
        else {
          formElement.submit();
        }
      }
    };

    // Lặp qua các rules và xử lý(lắng nghe các sự kiện...)
    option.rule.forEach(function (rule) {
      // Lấy ra tất cả các ru cho một thẻ input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }
      var inputElement = formElement.querySelector(rule.selector);
      if (inputElement) {
        var errorElement = inputElement.parentElement.querySelector(
          option.errorSelector
        );
        // Xử lý trường hợp nhập sai
        inputElement.onblur = function () {
          // Kiểm tra các inputElement
          vadidate(inputElement, rule);
        };
        // Xử lý trường hợp đang nhập
        inputElement.oninput = function () {
          errorElement.innerText = "";
          inputElement.parentElement.classList.remove("invalid");
        };
      }
    });
  }
}
// ĐỊnh nghĩa ra các rules
// Nguyên tắc của các rules
// 1.Khi có lỗi => trả ra message lôi
// 2.Khi hợp lệ =>KHông trả ra cái gì cả là undefined
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : message || "Vui lòng nhập trường này";
    },
  };
};
Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : message || "Trường này phải là email";
    },
  };
};
Validator.minLength = function (selector, length, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= length
        ? undefined
        : message || `Nhập tối thiểu ${length} kí tự`;
    },
  };
};
Validator.isComfirmed = function (selector, getComfirmValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getComfirmValue()
        ? undefined
        : message || "Giá trị nhập vào không chính xác";
    },
  };
};
// function Validator(option) {

//     const $ = document.querySelector.bind(document)
//     const $$ = document.querySelectorAll.bind(document)

//     var sellectorRules = {}
//     var formElement = $(option.form)
//     console.log(formElement)
//     var formElement = document.querySelector(option.form)
//     console.log(formElement)

// }
// // ============isRequried=============
// Validator.isRequired = function(sellector, message) {
//     return {
//         sellector: sellector,
//         test(value) {
//             return value.trim() ? true : message || 'Vui lòng nhập tên đầy đủ'
//         }
//     }
// }

// // =============isEmail================
// Validator.isEmail = function(sellector, message) {
//     return {
//         sellector: sellector,
//         test(value) {
//             var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//             return regex.test(value) ? true : message || 'Trường này phải là Email'
//         }
//     }
// }

// // ===============isLength===================
// Validator.minLength = function(sellector, lenght, message) {
//     return {
//         sellector: sellector,
//         test(value) {
//             return value.lenght > length ? true : message || `Nhập tối thiểu ${lenght} kí tự`
//         }
//     }
// }
// Validator.isComfirmed = function(sellector, getConfirmPassword, message) {
//     return {
//         sellector: sellector,
//         test(value) {
//             return value.trim() === getConfirmPassword ? true : message || 'Sai mật khẩu'
//         }
//     }
// }
