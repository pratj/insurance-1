import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import RenderCard from "../components/RenderCard";

test("renders renderCard component", () => {
  shallow(<RenderCard />);
});

test("renders renderCard component with parent div", () => {
  const wrapper = shallow(<RenderCard />);
  expect(wrapper.find('[data-test="renderCard"]').length).toBe(1);
});

// better approach is to give the button a className then test using that
test("render a button with text of `Don't know what to choose`", () => {
  const wrapper = shallow(<RenderCard />);
  expect(wrapper.find("footer").text()).toBe("Don't know what to choose?");
});

test("RenderCard snapshot", () => {
  const renderCardTree = shallow(<RenderCard />);
  expect(toJson(renderCardTree)).toMatchSnapshot();
});