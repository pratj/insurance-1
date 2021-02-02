import { shallow } from "enzyme";
import AboutUs from "../components/AboutUs";
import { render, screen } from "@testing-library/react";
import toJson from "enzyme-to-json";

test("renders aboutUs component", () => {
  shallow(<AboutUs />);
});

test("renders aboutUs component with parent div", () => {
  const wrapper = shallow(<AboutUs />);
  expect(wrapper.find('[data-test="aboutUs"]').length).toBe(1);
});

test("render names", () => {
  render(<AboutUs />);
  expect(screen.getByText(/prateek param rashwin/i)).toBeInTheDocument();
});

test("AboutUs snapshot", () => {
  const aboutUsTree = shallow(<AboutUs />);
  expect(toJson(aboutUsTree)).toMatchSnapshot();
});