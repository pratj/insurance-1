import { shallow } from "enzyme";
import Suggestion from "../components/Suggestion";
import { render, screen } from "@testing-library/react";
import toJson from "enzyme-to-json";

test("render suggestion component", () => {
  shallow(<Suggestion />);
});

test("renders suggestion component with parent div", () => {
  const wrapper = shallow(<Suggestion />);
  expect(wrapper.find('[data-test="suggestion"]').length).toBe(1);
});

test("renders `Hello, checkout some of our most popular Insurances` heading", () => {
  render(<Suggestion />);
  expect(
    screen.getByText(/Hello, checkout some of our most popular Insurances/i)
  ).toBeInTheDocument();
});

test("Suggestion snapshot", () => {
  const suggestionTree = shallow(<Suggestion />);
  expect(toJson(suggestionTree)).toMatchSnapshot();
});