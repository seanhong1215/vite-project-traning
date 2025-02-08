// import PropTypes from 'prop-types';

// const ProductDetail = ({ detail }) => {    
//   return (
//     !detail
//       ? <p className="text-secondary">請選擇一個商品查看</p>
//       : (
//         <div className="card">
//           <img src={detail.imageUrl} alt={detail.title} className="card-img-top" />
//           <div className="card-body">
//             <h3 className="card-title">
//               {detail.title}
//               <span className="badge bg-primary">{detail.category}</span>
//             </h3>
//             <p>{detail.description}</p>
//             <p>{detail.content}</p>
//             <p><del>{detail.origin_price}元</del> / {detail.price}元</p>

//             {detail.imagesUrl?.length > 0 && (
//               <div>
//                 {detail.imagesUrl.map((url, index) => (
//                   <img key={index} src={url} alt={url} />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )
//   );
// }

// ProductDetail.propTypes = {
//   detail: PropTypes.object.isRequired,
// };

// export default ProductDetail;