// this is basically: afterEach(cleanup)
import 'react-testing-library/cleanup-after-each'
import 'jest-dom/extend-expect'
import 'isomorphic-fetch'
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import '../../__mocks__/matchMedia'

Enzyme.configure({ adapter: new Adapter() });
