import { Button, Card } from "react-daisyui";

function CardComponents() {
  return (
    <div className="container-sm flex-auto gap-10">
      <div className="mb-3">Daftar Produk</div>
      <div className="grid grid-cols-3 gap-4">
        <Card side="lg">
          <Card.Image
            src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
          />
          <Card.Body>
            <Card.Title tag="h2">Shoes!</Card.Title>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <Card.Actions className="justify-end">
              <Button color="primary">Buy Now</Button>
            </Card.Actions>
          </Card.Body>
        </Card>
        <Card side="lg">
          <Card.Image
            src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
          />
          <Card.Body>
            <Card.Title tag="h2">Shoes!</Card.Title>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <Card.Actions className="justify-end">
              <Button color="primary">Buy Now</Button>
            </Card.Actions>
          </Card.Body>
        </Card>
        <Card side="lg">
          <Card.Image
            src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
          />
          <Card.Body>
            <Card.Title tag="h2">Shoes!</Card.Title>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <Card.Actions className="justify-end">
              <Button color="primary">Buy Now</Button>
            </Card.Actions>
          </Card.Body>
        </Card>
        <Card side="lg">
          <Card.Image
            src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
          />
          <Card.Body>
            <Card.Title tag="h2">Shoes!</Card.Title>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <Card.Actions className="justify-end">
              <Button color="primary">Buy Now</Button>
            </Card.Actions>
          </Card.Body>
        </Card>
        <Card side="lg">
          <Card.Image
            src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
          />
          <Card.Body>
            <Card.Title tag="h2">Shoes!</Card.Title>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <Card.Actions className="justify-end">
              <Button color="primary">Buy Now</Button>
            </Card.Actions>
          </Card.Body>
        </Card>
        <Card side="lg">
          <Card.Image
            src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
          />
          <Card.Body>
            <Card.Title tag="h2">Shoes!</Card.Title>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <Card.Actions className="justify-end">
              <Button color="primary">Buy Now</Button>
            </Card.Actions>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default CardComponents;
