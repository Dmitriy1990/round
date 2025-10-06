import Slider from './components/roundSlider/slider';
import { Heading } from './components';
import './styles/main.scss';

function App() {
  return (
    <div className="wrapper">
      <div className="container">
        <div className="main">
          <Heading title="Исторические даты" />
          <Slider />
        </div>
      </div>
    </div>
  );
}

export default App;
