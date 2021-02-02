import { shallow, mount } from "enzyme";
import RenderQuote from "../components/RenderQuote";
import { render, screen } from "@testing-library/react";
import toJson from "enzyme-to-json";

const quoteData = {
  category: "Motor Insurance",
  product: "Car Insurance",
  quoteData: [
    {
      partner: "Tata AIG",
      quote: {
        premium: 400,
      },
    },
  ],
};

const locationData = {
  location: {
    state: {
      quoteData: JSON.stringify(quoteData),
    },
  },
};

test("render renderQuote component", () => {
  shallow(<RenderQuote locationData={locationData} />);
});

test("renders renderQuote component with parent div", () => {
  const wrapper = shallow(<RenderQuote locationData={locationData} />);
  expect(wrapper.find('[data-test="renderQuote"]').length).toBe(1);
});

test("renders `Buy Now` button", () => {
  render(<RenderQuote locationData={locationData} />);
  expect(screen.getByText(/Buy now/i)).toBeInTheDocument();
});

test("accepts renderQuote props", () => {
  const wrapper = mount(<RenderQuote locationData={locationData} />);
  expect(wrapper.props().locationData).toEqual(locationData);
});

test("RenderQuote snapshot", () => {
  const renderQuoteTree = shallow(<RenderQuote locationData={locationData} />);
  expect(toJson(renderQuoteTree)).toMatchSnapshot();
});