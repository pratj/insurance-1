import { shallow, mount } from "enzyme";
import RenderForm from "../components/RenderForm";
import { render, screen } from "@testing-library/react";
import toJson from "enzyme-to-json";

const onSubmit = (data) => {
  console.log(data);
};

const formFields = [
  {
    name: "fullName",
    type: "text",
    label: "Full Name",
    placeholder: "Enter Full Name",
    validation: {
      required: {
        value: true,
        message: "Full Name is required",
      },
    },
  },
];

test("renders renderForm component", () => {
  shallow(<RenderForm formFields={formFields} onSubmit={onSubmit} />);
});

test("renders renderForm component with parent div", () => {
  const wrapper = shallow(
    <RenderForm formFields={formFields} onSubmit={onSubmit} />
  );
  expect(wrapper.find('[data-test="renderForm"]').length).toBe(1);
});

test("renders `Provide the following details` heading", () => {
  render(<RenderForm formFields={formFields} onSubmit={onSubmit} />);
  expect(
    screen.getByText(/provide the following Details/i)
  ).toBeInTheDocument();
});

test("render a button with text of `Submit`", () => {
  const wrapper = shallow(
    <RenderForm formFields={formFields} onSubmit={onSubmit} />
  );
  expect(wrapper.find("form").text()).toBe("Submit");
});

test("accepts renderForm props", () => {
  const wrapper = mount(
    <RenderForm formFields={formFields} onSubmit={onSubmit} />
  );
  expect(wrapper.props().formFields).toEqual(formFields);
  expect(wrapper.props().onSubmit).toEqual(onSubmit);
});

test("RenderForm snapshot", () => {
  const renderFormTree = shallow(
    <RenderForm formFields={formFields} onSubmit={onSubmit} />
  );
  expect(toJson(renderFormTree)).toMatchSnapshot();
});