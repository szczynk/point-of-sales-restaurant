import { Navbar, Button, Input, Form, Dropdown, Badge, Menu } from 'react-daisyui';



function NavbarComponents() {
    return (
        <Navbar className='bg-[#cc3636] mb-40 shadow-xl rounded-box'>
            <div className="flex-1">
                <Button tag="a" className="text-xl normal-case text-white" color="ghost">
                    Point of Sale
                </Button>
            </div>
            <div className="flex-none">
                <Menu horizontal={true} className="px-1 text-white">
                    <Menu.Item>
                        <details className='z-10'>
                            <summary>Category</summary>
                            <ul className="p-2 bg-base-100 text-blue-500">
                                <li>
                                    <a>Ayam</a>
                                </li>
                                <li>
                                    <a>Steak</a>
                                </li>
                                <li>
                                    <a>Bakmi & Bihun</a>
                                </li>
                                <li>
                                    <a>Sup & Soto</a>
                                </li>
                                <li>
                                    <a>Lontong</a>
                                </li>
                            </ul>
                        </details>
                    </Menu.Item>
                </Menu>
            </div>
            <div className="flex-none gap-2">
                <Form>
                    <Input bordered type="text" placeholder="Search" className="w-24 md:w-auto" />
                </Form>
                <Dropdown end>
                    <Button tag="label" tabIndex={0} color="ghost" className="avatar" shape="circle">
                        <div className="w-10 rounded-full">
                            <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                        </div>
                    </Button>
                    <Dropdown.Menu className="w-52 menu-sm mt-3 z-[1] p-2">
                        <li>
                            <a className="justify-between">
                                Profile
                                <Badge>New</Badge>
                            </a>
                        </li>
                        <Dropdown.Item>Settings</Dropdown.Item>
                        <Dropdown.Item>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </Navbar>

    );
}


export default NavbarComponents;
