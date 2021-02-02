import { shallow, mount } from "enzyme";
import MiniDrawer from "../components/MiniDrawer";
import { render, screen } from "@testing-library/react";
import toJson from "enzyme-to-json";
import RenderCard from "../components/RenderCard";

const location = {
  location: {
    state: {
      product: "Car Insurance",
      category: "Motor Insurance",
    },
  },
};

test("renders minidrawer component", () => {
  shallow(<MiniDrawer RenderComponent={RenderCard} location={location} />);
});

test("renders minidrawer component with parent div", () => {
  const wrapper = shallow(
    <MiniDrawer RenderComponent={RenderCard} location={location} />
  );
  expect(wrapper.find('[data-test="miniDrawer"]').length).toBe(1);
});

test("renders Insurance Bazaar heading", () => {
  render(<MiniDrawer RenderComponent={RenderCard} location={location} />);
  expect(screen.getByText(/Insurance Bazaar/i)).toBeInTheDocument();
});

test("accepts miniDrawer props", () => {
  const wrapper = mount(
    <MiniDrawer RenderComponent={RenderCard} location={location} />
  );
  expect(wrapper.props().RenderComponent).toEqual(RenderCard);
  expect(wrapper.props().location).toEqual(location);
});

test("MiniDrawer snapshot", () => {
  const miniDrawerTree = shallow(
    <MiniDrawer RenderComponent={RenderCard} location={location} />
  );
  expect(toJson(miniDrawerTree)).toMatchSnapshot();
});