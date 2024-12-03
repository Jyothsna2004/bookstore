import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import { FaMagic, FaBolt, FaMountain, FaSearch, FaHeart, FaBook, FaPen, FaGhost } from 'react-icons/fa';
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithIcon = [
  { id: "fantasy", label: "Fantasy", icon: FaMagic },          // Fantasy - Magic Icon
  { id: "thriller", label: "Thriller", icon: FaBolt },          // Thriller - Lightning Icon
  { id: "adventure", label: "Adventure", icon: FaMountain },    // Adventure - Mountain Icon
  { id: "mystery", label: "Mystery", icon: FaSearch },          // Mystery - Magnifying Glass Icon
  { id: "romance", label: "Romance", icon: FaHeart },           // Romance - Heart Icon
  { id: "history", label: "History", icon: FaBook },            // History - Book Icon
  { id: "biography", label: "Biography", icon: FaPen },         // Biography - Pen Icon
  { id: "horror", label: "Horror", icon: FaGhost }, 
];

const brandsWithIcon = [
  { id: "english", label: "English", img: "https://th.bing.com/th/id/OIP.1vX51nIfciezP5P6YiFFnQHaFY?w=275&h=200&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
  { id: "hindi", label: "Hindi", img: "https://w7.pngwing.com/pngs/711/296/png-transparent-devanagari-hindi-languages-of-india-spoken-language-hinduism-angle-english-text.png" },
  { id: "telugu", label: "Telugu", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Telugu.svg/400px-Telugu.svg.png" },
  { id: "tamil", label: "Tamil", img: "https://img.favpng.com/6/4/22/tamil-lexicon-dictionary-sri-lanka-tamil-script-tamils-png-favpng-hjh77X9wxsFEnRXqySQqZ96Tz.jpg" },
  { id: "korean", label: "Korean", img: "https://thumbs.dreamstime.com/b/korea-black-vector-calligraphy-text-word-lettering-korea-black-text-vector-stencil-silhouette-drawing-calligraphy-word-232422323.jpg" },
  { id: "marati", label: "Marati", img: "https://th.bing.com/th/id/R.e13ee16b03fc5a76f96d8188150e2577?rik=BCaK0okk9%2fM78A&riu=http%3a%2f%2fcollegecatta.com%2fwp-content%2fuploads%2f2017%2f11%2fMarathi_written_in_Devanagari_script.svg_.png&ehk=LiSs6gLU95c54TWQFpeP%2f5HoEP2l7dC65tRNsGAAh5s%3d&risl=&pid=ImgRaw&r=0"}
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  console.log(productList, "productList");

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
                key={categoryItem.id}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Language</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                key={brandItem.id}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  {/* Use img for language icons and increase size */}
                  <img
                    src={brandItem.img}
                    alt={brandItem.label}
                    className="w-16 h-16 mb-4 object-contain" // Increased size to w-16 h-16
                  />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {openDetailsDialog && productDetails && (
        <ProductDetailsDialog
          product={productDetails}
          onClose={() => setOpenDetailsDialog(false)}
          onAddToCart={handleAddtoCart}
        />
      )}
    </div>
  );
}

export default ShoppingHome;
