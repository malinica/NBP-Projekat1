using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataLayer.DTOs
{
    public class PaginatedResponseDTO<T>
    {
        public List<T>? Data { get; set; }
        public long TotalLength { get; set; }
    }
}