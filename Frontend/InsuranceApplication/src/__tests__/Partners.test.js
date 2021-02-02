import { shallow } from "enzyme";
import Partners from "../components/Partners";
import { render, screen } from "@testing-library/react";
import toJson from "enzyme-to-json";

test("renders partners component", () => {
  shallow(<Partners />);
});

test("renders partners component with parent div", () => {
  const wrapper = shallow(<Partners />);
  expect(wrapper.find('[data-test="partners"]').length).toBe(1);
});

test("renders Our Partners heading", () => {
  render(<Partners />);
  expect(screen.getByText(/Our Partners/i)).toBeInTheDocument();
});

test("Partners snapshot", () => {
  const partnersTree = shallow(<Partners />);
  expect(toJson(partnersTree)).toMatchSnapshot();
});