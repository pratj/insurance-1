import { shallow } from "enzyme";
import Products from "../components/Products";
import { render, screen } from "@testing-library/react";
import toJson from "enzyme-to-json";

test("renders products component", () => {
  shallow(<Products />);
});

test("renders products component with parent div", () => {
  const wrapper = shallow(<Products />);
  expect(wrapper.find('[data-test="products"]').length).toBe(1);
});

test("renders Our Products heading", () => {
  render(<Products />);
  expect(screen.getByText(/Our Products/i)).toBeInTheDocument();
});

test("Products snapshot", () => {
  const productsTree = shallow(<Products />);
  expect(toJson(productsTree)).toMatchSnapshot();
});