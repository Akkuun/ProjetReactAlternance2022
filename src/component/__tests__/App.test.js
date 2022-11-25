import { render, screen ,cleanup} from '@testing-library/react';
import App from '../App';
import ComponentUserManaging from "../componentUserManaging";

test('true test', () => {
  expect(true).toBe(true);
});

test('ComponentUserManaging should be in app', () => {

render(<ComponentUserManaging/>)
const idMainContent = screen.getByTestId("main-content");
expect(idMainContent).toBeInTheDocument();

});