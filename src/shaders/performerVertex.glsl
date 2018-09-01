float is_prime(int num)
{
     if (num <= 1) return 0.0;
     if (num % 2 == 0 && num > 2) return 0.0;

     for(int i = 3; i < int(floor(sqrt(float(num)))); i+= 2)
     {
         if (num % i == 0)
             return 0.0;
     }
     return 1.0;
}


void main( out vec4 fragColor, in vec2 fragCoord )
{
    int temp = (
        int(fragCoord.x + iTime * 80.0 + iMouse.x * 10.0)
        ^  // try & |
        int(fragCoord.y + iTime * 80.0 + iMouse.y * 10.0)
    );

    float p = is_prime(temp);

    fragColor = vec4(p / 0.4, p / 1.5, p, 1.0);
}